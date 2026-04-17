<?php

return [
    'default' => 'default',
    
    'fonts' => [
        'calibri' => [
            'R' => 'Calibri.ttf',
            'B' => 'Calibri-Bold.ttf',
            'I' => 'Calibri-Italic.ttf',
            'BI' => 'Calibri-BoldItalic.ttf',
        ],
        'sans-serif' => [
            'R' => 'DejaVuSans.ttf',
            'B' => 'DejaVuSans-Bold.ttf',
            'I' => 'DejaVuSans-Oblique.ttf',
            'BI' => 'DejaVuSans-BoldOblique.ttf',
        ],
    ],
    
    'font_cache' => storage_path('fonts/'),
    'temp_dir' => sys_get_temp_dir(),
    'log_output_file' => null,
    
    'default_font' => 'sans-serif',
    'default_paper_size' => 'a4',
    'default_paper_orientation' => 'portrait',
    
    'enable_remote' => true,
    'enable_html5_parser' => true,
    'enable_font_subsetting' => false,
    'enable_font_cache' => true,
    'chroot' => realpath(base_path()),
];