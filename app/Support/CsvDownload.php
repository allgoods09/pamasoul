<?php

namespace App\Support;

class CsvDownload
{
    public static function make(string $filename, array $header, iterable $rows)
    {
        return response()->streamDownload(function () use ($header, $rows) {
            $stream = fopen('php://output', 'w');
            fwrite($stream, "\xEF\xBB\xBF");
            fputcsv($stream, $header, ',', '"', '');
            foreach ($rows as $row) {
                // Keep user-authored cells from being interpreted as spreadsheet formulas.
                $row = array_map(fn ($value) => is_string($value) && preg_match('/^[\s]*[=+@-]/', $value) ? "'".$value : $value, $row);
                fputcsv($stream, $row, ',', '"', '');
            }
            fclose($stream);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
