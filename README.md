
<p align="center">
  <img src="https://github.com/yousefturin/reisto/assets/94796673/fc6e918e-0f1b-4a90-a008-bcf2d87730d2" width="100" />
</p>
<p align="center">
    <h1 align="center">Reisto</h1>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/yousefturin/reisto?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/yousefturin/reisto?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/yousefturin/reisto?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/yousefturin/reisto?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/Firebase-FFCA28.svg?style=flat&logo=Firebase&logoColor=black" alt="Firebase">
    <img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23323330.svg?style=style=flat&logo=javascript&logoColor=%23F7DF1E"/>
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/i18next-26A69A.svg?style=flat&logo=i18next&logoColor=white" alt="i18next">
	<img src="https://img.shields.io/badge/Expo-000020.svg?style=flat&logo=Expo&logoColor=white" alt="Expo">
    <img alt="React Native" src="https://img.shields.io/badge/react_native-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB"/>
    <img alt="Adobe Illustrator" src="https://img.shields.io/badge/adobeillustrator-%23FF9A00.svg?style=flat&logo=adobeillustrator&logoColor=white"/>
    <img alt="Figma" src="https://img.shields.io/badge/figma-%23F24E1E.svg?style=flat&logo=figma&logoColor=white"/>
</p>


## Quick Links

> - [Overview](#overview)
> - [Features](#features)
> - [Repository Structure](#repository-structure)
> - [Installation](#installation)
> - [Usage](#usage)
> - [Technologies Used](#technologies-used)
> - [Contributing](#contributing)
> - [License](#license)
> - [Contact](#contact)

## Overview

Reisto is a social media food recipes cross-application designed to bring together food enthusiasts from around the world. Users can share their favorite recipes, discover new dishes, and interact with a community of like-minded individuals.

![Screenshot 2024-04-22 at 18-portrait](https://github.com/yousefturin/reisto/assets/94796673/09149d59-a988-46b8-a7d0-6b78b4960d55)

## Features

- **Recipe Sharing:** Post and share your favorite recipes with the community.
- **Discover New Recipes:** Browse and discover recipes from other users.
- **Social Interaction:** Like, comment, and share recipes with friends and family.
- **User Profiles:** Create and customize your profile to showcase your culinary skills.
- **Cross-Platform:** Available on multiple platforms for ease of access.

## Repository Structure

```sh
└── reisto/
    ├── App.js
    ├── LICENSE
    ├── README.md
    ├── app.config.js
    ├── assets
    │   ├── HashBlurData.js
    │   ├── icon.png
    │   └── images
    │       └── SVG
    │           └── SvgStorage.js
    ├── babel.config.js
    ├── package.json
    └── src
        ├── Config
        │   ├── Constants.js
        │   ├── Schemas.js
        │   └── Theme.js
        ├── Locales
        │   ├── ar.json
        │   ├── en.json
        │   ├── ru.json
        │   └── tr.json
        ├── Service
        │   └── i18n.js
        ├── components
        │   ├── CustomComponent
        │   │   └── EmptyDataParma.js
        │   ├── FollowHome
        │   │   └── FollowHomeHeader.js
        │   ├── Home
        │   │   ├── Header.js
        │   │   ├── LoadingPlaceHolder.js
        │   │   ├── Modals.js
        │   │   ├── Navigation.js
        │   │   └── Post.js
        │   ├── Login
        │   │   └── LoginForm.js
        │   ├── Message
        │   │   ├── MessageLoadingPlaceHolder.js
        │   │   ├── MessageMainHeader.js
        │   │   ├── MessageMainItem.js
        │   │   ├── MessageMainList.js
        │   │   └── MessageMainSearchBar.js
        │   ├── MessagesIndividual
        │   │   ├── MessageItem.js
        │   │   ├── MessageList.js
        │   │   └── MessagesIndividualHeader.js
        │   ├── NewPost
        │   │   ├── AddNewPost.js
        │   │   ├── FoodCategoriesSelector.js
        │   │   └── FormikPostUploader.js
        │   ├── OthersProfile
        │   │   ├── OthersProfileContent.js
        │   │   └── OthersProfileHeader.js
        │   ├── PostFromMessages
        │   │   └── MessagePostHeader.js
        │   ├── Profile
        │   │   ├── ProfileContent.js
        │   │   ├── ProfileHeader.js
        │   │   └── ProfilePost.js
        │   ├── SavedPosts
        │   │   ├── SavedPostsGrid.js
        │   │   └── SavedPostsHeader.js
        │   ├── Search
        │   │   ├── LoadingPlaceHolder.js
        │   │   └── SearchSuggestion.js
        │   ├── Singin
        │   │   └── SinginForm.js
        │   ├── UserEditProfile
        │   │   ├── EditProfileForm.js
        │   │   ├── EditProfileHeader.js
        │   │   └── EditProfileImage.js
        │   ├── UserEditProfileIndividualData
        │   │   └── HeaderEditProfileIndividual.js
        │   └── UserSetting
        │       ├── LanguageSelector.js
        │       └── ThemeSelector.js
        ├── context
        │   ├── MessagesNumProvider.js
        │   ├── ThemeContext.js
        │   └── UserDataProvider.js
        ├── data
        │   ├── accountUser
        │   │   └── myAccount.js
        │   ├── post
        │   │   └── post.js
        │   └── users
        │       └── users.js
        ├── firebase.js
        ├── hooks
        │   ├── useAnimation.js
        │   ├── useCurrentUserFollowing.js
        │   ├── useFastPosts.js
        │   ├── useFastSavedPosts.js
        │   ├── useFastSearchPosts.js
        │   ├── useFollowing.js
        │   ├── useLastMessage.js
        │   ├── useMessages.js
        │   ├── usePostFromMessages.js
        │   ├── usePosts.js
        │   ├── useSavedPosts.js
        │   └── useShare.js
        ├── navigation
        │   ├── AppNavigation.js
        │   ├── AuthNavigation.js
        │   ├── splash.json
        │   └── splashtest.json
        ├── screens
        │   ├── AboutThisUserScreen.js
        │   ├── AddPostScreen.js
        │   ├── AdditionalSearchScreen.js
        │   ├── FollowingHomeScreen.js
        │   ├── FromMessagesToSharedPost.js
        │   ├── HomeScreen.js
        │   ├── LoginScreen.js
        │   ├── MessagingIndividualScreen.js
        │   ├── MessagingMainScreen.js
        │   ├── MessagingNewForFollowersAndFollowingScreen.js
        │   ├── NotificationScreen.js
        │   ├── OtherUsersProfileScreen.js
        │   ├── OthersProfilePostScreen.js
        │   ├── SearchExplorePostTimeLineScreen.js
        │   ├── SearchScreen.js
        │   ├── SignupScreen.js
        │   ├── UserActivityScreen.js
        │   ├── UserEditProfileIndividualDataScreen.js
        │   ├── UserEditProfileScreen.js
        │   ├── UserFollowingAndFollowersListScreen.js
        │   ├── UserProfilePostScreen.js
        │   ├── UserProfileScreen.js
        │   ├── UserSavedPostScreen.js
        │   ├── UserSavedPostTimeLineScreen.js
        │   └── UserSettingScreen.js
        └── utils
            ├── DeleteImageFromStorage.js
            ├── ExtractDomainFromLink.js
            ├── FormatCreateAt.js
            ├── GenerateChatId.js
            ├── NormalizeSize.js
            ├── SvgComponents.js
            ├── ThemeUtils.js
            ├── TimeBasedOnCreatedAt.js
            ├── TimeDifferenceCalculator.js
            ├── UploadImageToStorage.js
            └── UseCustomTheme.js
```

## Installation

To run the project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yousefturin/reisto.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd reisto
    ```

3. **Install the dependencies:**

    ```bash
    npm install
    ```

4. **Start the application:**

    ```bash
    npm start
    ```

## Usage

Once the application is running, you can:

- Create an account or log in if you already have one.
- Browse through the feed to discover new recipes.
- Post your own recipes by clicking on the "Add Recipe" button.
- Interact with other users by liking, commenting, and sharing recipes.

## Technologies Used

- **Frontend:** React Native
- **Backend:** Node.js
- **Database:** Firebase
- **Authentication:** Firebase Auth
- **APIs:** Private APIs for image uploads to the Firebase storage bucket
- **Testing:** Jest, Enzyme

## Contributing

We welcome contributions from the community! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch:

    ```bash
    git checkout -b feature-branch
    ```

3. Make your changes and commit them:

    ```bash
    git commit -m "Add new feature"
    ```

4. Push to the branch:

    ```bash
    git push origin feature-branch
    ```

5. Open a pull request detailing your changes.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.

License: CC BY-NC 4.0

You are free to:

- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial** — You may not use the material for commercial purposes.

For more details, visit the license page.

## Contact

For any questions or feedback, feel free to reach out:

- **Author:** Yusef Rayyan
- **Email:** <yusefturin@gmail.com>

---

Feel free to explore, contribute, and enjoy the world of recipes with Reisto!
