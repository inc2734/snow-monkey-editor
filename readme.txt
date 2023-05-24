=== Snow Monkey Editor ===
Contributors: inc2734, rocketmartue
Donate link: https://www.amazon.co.jp/registry/wishlist/39ANKRNSTNW40
Tags: gutenberg, block, blocks, editor, gutenberg blocks, page builder
Requires at least: 6.2
Tested up to: 6.2
Stable tag: 9.2.5
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

== Changelog ==

= 9.2.5 =
* Fixed a bug that blocks with display settings by window size may switch display at unintended timing.

= 9.2.4 =
* Fix PHP fatal error.

= 9.2.3 =
* Fix PHP fatal error.

= 9.2.2 =
* Fixed a bug that caused a blank screen in the post editor for custom post types with their own permissions set.

= 9.2.1 =
* Changed the display position of the presets and extensions settings panel to the bottom.

= 9.2.0 =
* Fixed a bug that could cause text to disappear when a preset is applied to a paragraph block.
* Update CSS.
* Add block styles. "Speech (Left)", "Speech (Top)" and "Speech (Right)".
* Change `Popover.isAlternate` to `Popover.variant`.

= 9.1.2 =
* Fix PHP Warning error.
* Fixed a bug that broke blocks when selecting colors defined in CSS vars in the highlighter.
* Update badge style.

= 9.1.1 =
* Fixed a bug that block was broken when changing the block style with a user belonging to a custom role.
* Fixed a bug that when the font size format picker was opened with the font size format already set, the set font size was sometimes not selected.

= 9.1.0 =
* Add block presets feature.

= 9.0.3 =
* Fixed a bug that the extension panel of "Snow Monkey Editor" displayed an empty panel even for blocks that did not need it.

= 9.0.2 =
* Update the extension panel UI.

= 9.0.1 =
* Added reset button to font size format.
* Fixed a bug that popover sometimes jumps to the upper left corner of the screen when setting colors in text color, background color, highlighter, and badge.
* Changed Popover to close when letter spacing, line height, and fon tsize are reset.

= 9.0.0 =
* Requires WordPress 6.1 or later.
* Updated the display to make it easier to see the display restrictions by role on the editor.
* Fixed a bug where margins were not given inside the formatting popover for non-Snow Monkey themes.

= 8.0.2 =
* Fixed that the picker closes when a number is crossed out or 0 is entered for font size, letter spacing, and line height.

= 8.0.1 =
* Fix PHP error.

= 8.0.0 =
* Requires WordPress 6.0 or later.
* Changed font-size and line-height format `display` from `inline-block` to `inline` in the list.
* Changed so that extensions settings are not displayed in the classic block.
* Fixed a bug that the icons displayed on the block toolbar did not reflect the proper color when formatting was applied.

= 7.0.1 =
* Update sass-basis@17.0.0

= 7.0.0 =
* Requires WordPress 5.9 or later.
* End of support for ie11.
* Changes due to changes in WordPress 5.9.

= 6.2.1 =
* Fixed a bug that prevented setting a custom value for font size.

= 6.2.0 =
* Fixed a bug that selecting a font size would not add the class, but px value.
* Changed so that rem is not added to the unit when line-height is set.
* Changed `.sme-font-size` and `.sme-line-height` to `inline-block`.

= 6.1.0 =
* Add block styles for code block. "No wrap" and "Wrap".

= 6.0.1 =
* If you set "hidden-by-size", the target block is translucent on editor when the editor is at that size.
* Change the "hidden-by-role" setting so that your role cannot be set. (Except for administrator)

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
