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
    }
]