# Changelog
All notable changes for this project will be documented in this file.

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