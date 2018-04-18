# Changelog
All notable changes for this project will be documented in this file.

## 0.1.3 - 2018-04-18
### Changed
- outlines now have a "title" and "text" for each point
- books in the list view now work a bit better on large screens

### Fixed
- book searches complete even if a result has no thumbnail links
- outlines with more than 9 items no longer throw errors
- menu icons should now be fixed

## 0.1.2 - 2018-04-14 - Deployed
### Added
- pwa mode for quasar
- NQ icons instead of the default quasar icons
- vue2-editor for Topics
- vue2-edtior for MediaNotes
- vue2-editor for Composition editing
- code in App.vue to disable FastClick -- important to editors working on pwas

### Changed
- removed testing code from Dashboard

## 0.1.1 - 2018-04-13
### Added
- masonry plugin

### Changed
- List now uses singular types rather than plural
- all lists (save notes and topics which use qlist) use the new masonry layout
- resources list (MediaList) now uses the new masonry layout

## 0.1.0 - 2018-04-07 - Deployed
WOHOO!! Finally made it to a version I can proudly say is usable! Version 0.1.0 still has a long ways to go before being ready for the world, but it is ready for single user testing. The main known issues are listed below, and there will surely be more to come...but it's workable! A big step forward :)

### Added
- manually updated version number shown in left drawer in NQ layout

### Changed
- margins and widths for Lists, books are now in 2 columns on small screens, margins are based on percentages to get a more consistent experience across devices
- book cover images now display a much smaller thumbnail on mobile devices and small screens
- rearranged fields on several Media screens for better viewing on mobile
- QuoteList now uses buttons instead of icons for adding snippets and toggling all snippets
- QuoteList now hides divs of snippets in which there are none
- NQ Layout now keeps the left drawer sticky

### Fixes
- Topics and Notes now don't duplicate bibleRefs

### Known Issues
- sometimes images are not displaying in the List on mobile -- needs more testing

## 0.0.19 - 2018-04-07
### Added
- get-video-id plugin for parsing video urls

### Changed
- Discourse now shows Authors in a chips input and Date Occurred in a Datetime input
- Discourse url now shows embedded video if link is a youtube or vimeo link
- List now has a better system for determining whether to use cards, bricks, or a list to display the items
- Composition url now shows embedded video if link is a youtube or vimeo link
- ALL Media now uses chips input for Author with the add icon being a plus sign

### Fixed
- AddMedia button disabling works properly now
- cleaned up some messy code here and there

## 0.0.18 - 2018-04-07
### Changed
- Articles now can add snippets
- Quotes from Articles come from selecting text

### Fixed
- updated click functions for snippet list items to click.native

## 0.0.17 - 2018-04-06
### Added
- selection feature in Article to add Quotes -- still needs to finalize adding the Quote to the database

### Changed
- Discourse now has a space for a link

## 0.0.16 - 2018-04-06
### Fixed
- when adding media, the add button is disabled after it is clicked the first time, preventing duplicate adds due to server process wait times

## 0.0.15 - 2018-04-02
### Added
- Document, Discourse, and Composition pages and routes
- add options for Document, Discourse, and Composition
- Illustration as a new snippet

### Changed
- changed test port to 3000
- updated Login page to display properly on mobile

## 0.0.14 - 2018-03-23
### Changed
- updated database plugin to use new database url

## 0.0.13 - 2018-03-23
### Changed
- fixed the BibleRef duplication issue when watching for changes

## 0.0.12 - 2018-03-21
### Added
- Quotes, Outlines, and Ideas can now be selected when using the resource select option in Topic

### Changed
- Updated AddMedia to be usable within a Topic
- Combined all AddMedia functions into a single function
- Adding Media from a Topic now adds it to the database as well as to the Topic's media list

## 0.0.11 - 2018-03-15
### Added
- OutlineListItem - QCard
- IdeaListItem - QItem
- some functionality to ResourcePreview for Topics
    - shows thumbURL, title, and snippets list for books and movies
- bricks layout to Outline list items
- bricks layout to Images list
- started playing with getting clickable references/comments in Topic notes

### Changed
- fixed some spacing issues on OutlineForm
- Outline points is now just an array of strings -- (fixed huge issues with updating the database)
- After updating a quote or outline, the listed version is updated with the new data after clicking Update
- After adding a new quote, outline, or idea, it is appended to the local list rather than needing a full refresh of snippets from the server

### Issues
- certain fields are automatically populated from the form for quotes, outlines, and ideas onto the listed versions...but if those changes aren't updated, they continue to show in the listed versions

## 0.0.10 - 2018-03-14
### Added
- IdeaForm to add and edit Ideas
- OutlineForm to add and edit Outlines
    - Outline functionality not finished
- Movies can now be added
- Movie page
- Movie route
- Started ability to add pieces to outlines
- added blank ResourcePreview component for viewing resources from within a Topic

### Changed
- changed quotes function in database plugin to snippets, edited other places used accordingly
- cleaned up some unused commented code in QuoteForm and QuoteList
- Topic resources are now uncategorized
- Topic resources use a waterfall/bricks layout
- fixed incorrect variables in Article.vue
- removed need to click through menu to view media when listing Books, Movies, Articles, and Movies

### Issues
- Topic resources waterfall/brick layout needs to be "packed" on every load...but can't seem to be done programatically without some user interaction

## 0.0.9 - 2018-03-13
### Added
- new Research routes for List and Topic
- Topic page
- Topic list page under Research
- AddResearch modal to add new Topics from the Topic list page
- Sidebar in Research for Topic resources
- TopicResources component to put in sidebar
- resources functionality for database plugin
- Topic resources divy up by type into collapsible list items
- new plugin to manage selectedTopic to add resources to that topic
- MediaList component that displays the media passed in an array as cards or lists, etc.
- Add button now appears on every media (missing quotes) to add to the currently selected Topic
- Selected topic button in header returns to the topic page
- Select button on Topic page to set as selected topic and allow for user to add resources

### Changed
- updated AddMedia with row and col for input fields to have gutters when rendered
- list of Notes now renders correctly

### Issues
- class names are not siloed properly between components - there's bleed over into other components - not ideal...

## 0.0.8 - 2018-03-12
### Added
- AddMedia component
- add media modal added to the NQ layout
- AddMedia for Books
- Google books search works with new database plugin
- Image page
- Note page
- Video page
- AddMedia for wiki Images
- AddMedia for Notes
- AddMedia for Videos

### Changed
- Book gets rating and status from UserData
- set login fields to dark
- redesigned login layout
- updated login to use new firebase method (this.firebase)

Probably a lot more...this is all I could remember. Still just working towards full-functionality again.

## 0.0.7 - 2018-03-09
### Added
- lookup function for database plugin

### Changed
- adding or updating quotes will refresh the whole quote list

### Notes
- a full refresh isn't the most efficient way of adding new quotes - looking to add a system that would just add the new quote to the array in quote list after the data has been sent to the server - would reduce the number of calls made when adding a whole list of quotes

## 0.0.6 - 2018-03-08
### Added
- add function for database plugin
- new add functionality to QuoteForm

### Notes
- ids for new generated objects don't match ids of objects generated in Firebase -- might cause problems in future? -- update function still works with quotes generated with new add functionality

## 0.0.5 - 2018-03-07
### Added
- view function for database plugin
- Book now uses new database view function
- quotes function for database plugin
- QuoteList now uses new database quotes function
- remove function for database plugin - just a placeholder

### Changed
- List now pulls from author.fullName to render
- Removed extra line in List to render Images differently - added same logic to a conditional class
- Book now uses thumbURL rather than imageURL for thumbnail
- Book now uses userData from new database
- Book now updates to new database
- Quotes are now updated in new database
- "Delete" changed to "Remove" on Book
- "Delete" changed to "Remove" on QuoteForm
- User notes are kept updated between Book and MediaNotes component

### Known Issues
- Book, Movie, and Article authors are going to have issues with input fields...multiple authors means keeping track of multiple inputs
- No way to add quotes to new database

## 0.0.4 - 2018-03-06
### Changed
- database plugin
    - updated to send user's authentication token to server
- List now uses new database to get items rather than Firebase

## 0.0.3 - 2018-03-05
### Added
- started new database plugin!!
    - still in initial stages
    - custom built to access backside database
- added Dashboard page (mostly being used to test database)

## 0.0.2 - 2018-03-02
### Added
- NQ layout for most Notes and Quote pages
- List page for displaying media by type
- fuse.js plugin
- vuefire plugin
- logo.png file

### Changed
- Fixed form spacing issues on Book page
- Fixed form spacing issues on Quote Form modal
- firebase references are now available from this.firebase
- Drawer links use router objects rather than simple paths to link

### Known issues
- Drawer icons sizes are not consistent from one page to another (ex. from a list page to a book page), this causes some icons to not render at all

## 0.0.1 - 2018-03-02
### Added
- This CHANGELOG file for recording future changes and updates

### Changed
- README file now has basic info about Notes and Quotes

## 0.0.0 - 2018-03-01
### Status
- This version is still in progress of being upgraded to the new Quasar file structure introduced in 0.15.