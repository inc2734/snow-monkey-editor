=== Snow Monkey Editor ===
Contributors: inc2734, rocketmartue
Donate link: https://www.amazon.co.jp/registry/wishlist/39ANKRNSTNW40
Tags: gutenberg, block, blocks, editor, page builder
Stable tag: 13.0.1
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

The Snow Monkey Editor is a plugin that extends the block editor.

== Description ==

The Snow Monkey Editor is a plugin that extends the block editor.

GitHub: https://github.com/inc2734/snow-monkey-editor/

= Formatter =

Click Snow Monkey button in toolbar.

* Text badge
* Text background color
* Text font size
* Text highlighter
* Text color
* Text gradient
* Text letter spacing
* Line break per screen size
* Format clear

= Extensions =

You can settings in inspector.

* Hide on smartphone size or tablet size or PC size. (Using media query)
* Hide by user roles. (Using `render_block` filter hook. If it does not pass this filter, it is ignored)
* Scroll animation
* Publish date time settings
* Unpublish date time settings
* Edit lock by user roles. (Only administrators can set it)

= Block presets =

This feature allows you to save the settings of a block and set them for other blocks of the same type at the touch of a button.

(The number of blocks/attributes that can be used by the block preset feature is limited by default.)

= Block styles =

There can be used in paragraph blocks, group blocks, image blocks, etc.

* Alert
* Alert (Remarks)
* Alert (Success)
* Alert (Warning)
* Fluid shapes
* Post-it
* Post-it (Narrow)
* Shadowed
* Speech (Top)
* Speech (Right)
* Speech (Bottom)
* Speech (Left)
* List (Arrow)
* List (Check)
* List (Remarks)
* List (Times)
* Ordered list (Circle)
* Ordered list (Square)

= Filter hooks (JavaScript) =

**SnowMonkeyEditor.extension.allowedNameSpaces**

JavaScript

`import { addFilter } from '@wordpress/hooks';

addFilter(
  'SnowMonkeyEditor.extension.allowedNameSpaces',
  'snow-monkey-blocks/apply-snow-monkey-editor-extensions',
  ( allowedNameSpaces, extensionName ) => {
    return [
      ...allowedNameSpaces,
      'snow-monkey-blocks',
    ];
  }
);`

PHP

`add_action(
	'admin_enqueue_scripts',
	function() {
		$data = "wp.hooks.addFilter(
			'SnowMonkeyEditor.extension.allowedNameSpaces',
			'snow-monkey-blocks/apply-snow-monkey-editor-extensions',
			( allowedNameSpaces, extensionName ) => {
				return [
					...allowedNameSpaces,
					'snow-monkey-blocks',
				];
			}
		);";
		wp_add_inline_script(
			'snow-monkey-editor@editor',
			$data
		);
	}
);`

**SnowMonkeyEditor.extension.allowedRoles**

JavaScript

`import { addFilter } from '@wordpress/hooks';

addFilter(
  'SnowMonkeyEditor.extension.allowedRoles',
  'snow-monkey-blocks/apply-snow-monkey-editor-extensions',
  ( allowedNameSpaces, extensionName ) => {
    return [ 'administrator' ];
  }
);`

PHP

`add_action(
	'admin_enqueue_scripts',
	function() {
		$data = "wp.hooks.addFilter(
			'SnowMonkeyEditor.extension.allowedRoles',
			'snow-monkey-blocks/apply-snow-monkey-editor-extensions',
			( allowedRoles, extensionName ) => {
				return [ 'administrator' ];
			}
		);";
		wp_add_inline_script(
			'snow-monkey-editor@editor',
			$data
		);
	}
);`

== Installation ==

This plugin can be installed directly from your site.

1. Log in and navigate to Plugins → Add New.
1. Type “Snow Monkey Editor“ into the Search and hit Enter.
1. Locate the Snow Monkey Editor plugin in the list of search results and click Install Now.
1. Once installed, click the Activate link.

== Frequently Asked Questions ==

= Can the Snow Monkey Editor be used with any theme? =

Yes! You can use the Snow Monkey Editor with any theme, but we recommend using our <a href="https://snow-monkey.2inc.org/" target="_blank">Snow Monkey</a> theme for the best presentation.

== Screenshots ==

1. Text badge
2. Text background color
3. Text font size
4. Text letter spacing
5. Text highlighter
6. Text color
7. Hide on smartphone size or tablet size or PC size.
8. Hide by user roles.
9. Scroll animation settings
10. Publish settings
11. Unpublish settings
12. Edit lock by user roles.
13. Alert
14. Alert (Remarks)
15. Alert (Success)
16. Alert (Warning)
17. Fluid shapes 1
18. Fluid shapes 2
19. Fluid shapes 3
20. Post-it
21. Post-it (Narrow)
22. Shadowed images
23. Shadowed button
24. Speech
25. List (Arrow)
26. List (Check)
27. List (Remarks)
28. List (Times)

== Upgrade Notice ==

Nothing in particular.
