=== Snow Monkey Editor ===
Contributors: inc2734, rocketmartue
Donate link: https://www.amazon.co.jp/registry/wishlist/39ANKRNSTNW40
Tags: gutenberg, block, blocks, editor, gutenberg blocks, page builder
Requires at least: 5.3
Tested up to: 5.3
Stable tag: 0.5.2
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
* Alert (Remark)
* Alert (Success)
* Alert (Warning)
* Fluid shapes
* Post-it
* Post-it (Narrow)
* Shadowed
* Speech

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
4. Text highlighter
5. Text color
6. Hide on smartphone size or tablet size or PC size.
7. Hide by user roles.
8. Scroll animation settings
9. Publish settings
10. Unpublish settings
11. Edit lock by user roles.
12. Alert
13. Alert (Remark)
14. Alert (Success)
15. Alert (Warning)
16. Fluid shapes 1
17. Fluid shapes 2
18. Fluid shapes 3
19. Post-it
20. Post-it (Narrow)
21. Shadowed
22. Speech

== Changelog ==

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
