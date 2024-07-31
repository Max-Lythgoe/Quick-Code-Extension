export const codeSnippets = [
    {
        id: 1,
        title: 'Repeater Code',
        isFavorite: true,
        codeCopy: 
        `<?php if( have_rows('steps') ): ?>
    <div class="steps">
    <?php while( have_rows('steps') ): the_row(); ?>
        <div class="step">
			<?php echo do_shortcode('[step-title]'); ?>
			<?php the_sub_field('step_text'); ?>
        </div>
    <?php endwhile; ?>
    </div>
<?php endif; ?>`
    },
    {
        id: 2,
        title: 'Escaping HTML ACF',
        isFavorite: false,
        codeCopy: 
        `// Allow script tags in ACF subfields
add_filter('wp_kses_allowed_html', 'acf_allow_script_tags', 10, 2);
function acf_allow_script_tags($tags, $context) {
    if ($context === 'acf') {
        $tags['script'] = array(
            'src' => true,
            'type' => true,
            'async' => true,
            'defer' => true,
            'nonce' => true,
            'language' => true,
            'charset' => true,
            'crossorigin' => true,
            'integrity' => true,
            'nomodule' => true,
            'onload' => true,
            'onerror' => true,
            'nonce' => true,
            'nonce' => true,
            'nonce' => true,
            // Add any other script-related attributes you need
        );
    }

    return $tags;
}

// Fix ACF escaping HTML (iframes)
add_filter( 'wp_kses_allowed_html', 'acf_add_allowed_iframe_tag', 10, 2 );
function acf_add_allowed_iframe_tag( $tags, $context ) {
    if ( $context === 'acf' ) {
        $tags['iframe'] = array(
            'src'             => true,
            'height'          => true,
            'width'           => true,
            'frameborder'     => true,
            'allowfullscreen' => true,
        );
    }

    return $tags;
}
`
    }, 
    {
        id: 3,
        title: 'PHP Shortcode',
        isFavorite: true,
        codeCopy: 
        `<?php echo do_shortcode('[hero-title]'); ?>`
    }
]