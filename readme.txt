=== Snow Monkey Editor ===
Contributors: inc2734, rocketmartue
Donate link: https://www.amazon.co.jp/registry/wishlist/39ANKRNSTNW40
Tags: gutenberg, block, blocks, editor, gutenberg blocks, page builder
Requires at least: 5.8
Tested up to: 5.8
Stable tag: 6.0.0
Requires PHP: 5.6
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
* Text letter spacing
* Format clear

= Extensions =

You can settings in inspector.

* Hide on smartphone size or tablet size or PC size. (Using media query)
* Hide by user roles. (Using `render_block` filter hook. If it does not pass this filter, it is ignored)
* Scroll animation
* Publish date time settings
* Unpublish date time settings
* Edit lock by user roles. (Only administrators can set it)

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
* Speech
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

== Changelog ==

= 6.0.0 =
* Compatible with WordPress 5.8. 5.7 is not supported.

= 5.0.6 =
* Fixed a bug where the "Fluid shape" block style was not being applied to media and text blocks.

= 5.0.5 =
* Update sass-basis

= 5.0.4 =
* Fixed a bug that prevented the use of Snow Monkey Blocks plugin blocks.

= 5.0.3 =
* Fixed a bug in which saving was sometimes performed consecutively when used with other plugins.

= 5.0.2 =
* Fixed a bug where the popover would not disappear but jump to the top left corner of the screen when resetting or clearing each formatting.

= 5.0.1 =
* Fixed a bug that the text size would start from 1 when resizing with the text size preset set.

= 5.0.0 =
* Updates to support WordPress 5.7.

= 4.1.0 =
* Add line-height format.
* Fixed a bug that the text size setting doesn't work properly on WordPress 5.6.2.

= 4.0.1 =
* Fix bug that prevented the date time setting extension from being displayed.

= 4.0.0 =
* WordPress 5.6 compatibility.
* Add animation delay setting.
* Add animation speed setting.
* Add text letter spacing format.

= 3.0.5 =
* Remove wp-polyfill on frontend.

= 3.0.4 =
* Fixed color picker of formats bug.

= 3.0.3 =
* Fixed a bug that custom colors for each formatting could not be entered or changed.

= 3.0.2 =
* Fix block styles CSS bug in editor.

= 3.0.1 =
* Bug fixes.

= 3.0.0 =
* Requires WordPress 5.5

= 2.1.2 =
* Fixed a bug where the caption was hidden when applying fluid shapes.

= 2.1.1 =
* Change `.sme-hidden-xxx` styles. Using `display: none`.

= 2.1.0 =
* Add animation "Fade in down".

= 2.0.0 =
* WordPress 5.4 compatible

= 1.1.0 =
* Add animation "Fade in up".
* Add filter hook `SnowMonkeyEditor.extension.allowedRoles`.

= 1.0.0 =
* Extensions has been changed to apply only to core blocks and Snow Monkey Blocks.
* Add filter hook `SnowMonkeyEditor.extension.allowedNameSpaces`.

= 0.8.2 =
* Fix php notice error.

= 0.8.1 =
* Fixed a bug that start and reverse were not reflected in the order list (square).

= 0.8.0 =
* Add block styles for ordered list.

= 0.7.0 =
* Add shadowed button block style.
* Update browserslist. Using @wordpress/browserslist-config

= 0.6.1 =
* Add block styles of list block.

= 0.6.0 =
* Add block styles of list block.

= 0.5.4 =
* Change extension panel monkey icon color.

= 0.5.3 =
* Fixed bug that selecting the custom colors in a popover would close the custom colors popover.

= 0.5.2 =
* Fix bug that popover is displayed when deleting paragraph.

= 0.5.1 =
* Fixed bug that selecting a custom color of the format would break the block.

= 0.5.0 =
* Add the extension that setting scroll animation.
* Fix publish/unpublish setting bug. RESETTING IS REQUIRED.
* Fix bug that dynamic blocks were not displayed.

= 0.4.1 =
* Fixed a bug that the block may be broken by the effect of extension.

= 0.4.0 =
* Add the extension that publish setting for each blocks.
* Add the extension that unpublish setting for each blocks.
* IF the block is enabled extension, the extension icon colored.
* Roles that can be selected with the edit lock function are limited to roles that have edit_posts capability.

= 0.3.0 =
* Add the extension that block edit lock by user roles.

= 0.2.4 =
* Change display condition of format popover.

= 0.2.3 =
* Fixed a bug where blocks could be destroyed.
* Fix the speech block style design.

= 0.2.2 =
* Fix the speech block style design.

= 0.2.1 =
* Fix bug that the Additional CSS Classes can not edit.

= 0.2.0 =
* Add a extension that hide by user roles.

= 0.1.0 =

* Initial release.

== Upgrade Notice ==

Nothing in particular.
