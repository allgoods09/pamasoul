<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AdController extends Controller
{
    public function getAds(Request $request)
    {
        $position = $request->get('position', 'sidebar');
        $limit = $request->get('limit', 3);
        
        // Cache ads for 5 minutes to reduce API calls
        $cacheKey = "ads_{$position}_{$limit}";
        
        return Cache::remember($cacheKey, 300, function () use ($position, $limit) {
            $ads = [];
            $seenTitles = [];
            
            for ($i = 0; $i < $limit * 2; $i++) {
                if (count($ads) >= $limit) break;
                
                try {
                    $zoneKey = 'CVADC53U';
                    
                    $response = Http::timeout(2) // 2 second timeout
                        ->get("https://srv.buysellads.com/ads/{$zoneKey}.json", [
                            'ignore' => 'yes',
                            '_' => time() . rand(1, 1000),
                        ]);
                    
                    if ($response->successful() && isset($response->json()['ads'][0])) {
                        $adData = $response->json()['ads'][0];
                        $title = $adData['company'] ?? $adData['callToAction'] ?? 'Advertisement';
                        
                        if (!in_array($title, $seenTitles)) {
                            $seenTitles[] = $title;
                            
                            $colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'];
                            $randomColor = $colors[array_rand($colors)];
                            
                            $ads[] = [
                                'id' => 'external_' . time() . '_' . $i,
                                'title' => $title,
                                'description' => $adData['description'] ?? '',
                                'image_url' => $adData['image'] ?? $adData['logo'] ?? null,
                                'link_url' => $adData['statlink'] ?? '#',
                                'position' => $position,
                                'bg_color' => $randomColor,
                                'text_color' => '#FFFFFF',
                            ];
                        }
                    }
                    
                    usleep(50000); // 50ms delay
                } catch (\Exception $e) {
                    // Fallback ads
                    if (count($ads) < $limit) {
                        $fallbackAds = [
                            ['title' => 'Premium Fishing Gear', 'description' => 'Shop the best rods and reels', 'bg_color' => '#3B82F6'],
                            ['title' => 'Limited Time Offer', 'description' => 'Free shipping on orders ₱1000+', 'bg_color' => '#EF4444'],
                            ['title' => 'New Arrivals', 'description' => 'Check out our latest collection', 'bg_color' => '#10B981'],
                            ['title' => 'Weekend Sale', 'description' => 'Up to 30% off selected items', 'bg_color' => '#F59E0B'],
                            ['title' => 'Member Exclusive', 'description' => 'Sign up for special discounts', 'bg_color' => '#8B5CF6'],
                        ];
                        
                        $fallback = $fallbackAds[count($ads) % count($fallbackAds)];
                        $ads[] = [
                            'id' => 'fallback_' . time() . '_' . count($ads),
                            'title' => $fallback['title'],
                            'description' => $fallback['description'],
                            'image_url' => null,
                            'link_url' => '/shop',
                            'position' => $position,
                            'bg_color' => $fallback['bg_color'],
                            'text_color' => '#FFFFFF',
                        ];
                    }
                }
            }
            
            return response()->json([
                'success' => true,
                'ads' => $ads,
                'source' => 'buysellads',
                'count' => count($ads)
            ])->getData(true);
        });
    }
    
    public function trackClick(Request $request, $adId)
    {
        // Async logging - don't block response
        dispatch(function () use ($adId, $request) {
            \Log::info('Ad clicked', ['ad_id' => $adId, 'ip' => $request->ip()]);
        });
        
        return response()->json(['success' => true]);
    }
}