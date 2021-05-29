<div align="center" ><h1> Draw-It </h1></div>

## Problem Statement: 


Ever since the start of pandemic,education has seen a gradual fallback from classroom studies to online sessions over video meets and screen sharings.The fallback was worst on quality front, where students were being taught through passing slides.With each passing slide, what was taught and what wasn't taught became equally same. Being a part of this roll over, it inspired us to do something innovative.There was a strict need of elevating Online Education through drawing and discussing doubts which could not be more easily done then on a mobile phone.urban students have access to Tablets , where they can easily communicate their problems to the teacher through JamBoards and teachers can also solve their problems. The major drawback is for rural area students, where it gets difficult for them to understand the content as it is always a one-way communication. Elementary school students, who are being taught alphabets ,words and numbers can never learn them unless they imitate them side by side with the mentor over there copies. Similarly a mentor can never get a positive feedback of how much his students are learning unless he sees there work in real time.This brings us to the idea we named : DRAWIT.
Same is the case with high school students,though they can learn on their own, a teacher never comes to know if his student is able to write the next step along with him in a question unless the student writes it and shows it to him in real time. In all these scenarios , DRAWIT proves to be a big weapon of help.



## The workflow of our project:

It's a basic student-mentor deployed system. The mentor creates a room where students can join and mentor can share his screen.The mentor then clicks the capture button on the application and a snapshot of the present screen is taken and the background is removed (through OpenCV processing). Then this image is imprinted on the ongoing video stream of the mentor as well as all the students in the room. Then, if any student has a doubt in any step or wants to draw anything on his/her notebook and to share with the mentor, the capture button is clicked on the student side and the same process happens again. This will work turn by turn and a blackboard chat system is formed.




This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



# Backend Django app


## Setup/Installation

1. [Create a Twilio account](https://www.twilio.com) (if you don't have one yet). It's free!


2. [Generate an API Key](https://www.twilio.com/console/project/api-keys) for your account.

3. Now, set the directory path where you want to clone and also the directory where you will write solutions

```sh
cd INSTALLATION_PATH 
```
4.  Clone this repository `https://github.com/jainil-4801/Draw-It.git`
or u can download and extact the zip file.


5. Copy paste the API Keys from your twillio account after making a copy of .env.template
```sh
cp .env.template .env
```
6. Create a virtual environment
```sh
pip install virtualenv
virtualenv venv
```
- Activate virtual environment (macOS or Linux)
```sh
source venv/Scripts/activate
```
- Activate virtual environment (Windows)

```sh
venv\Scripts\activate 
```
7. Installing requirements
```sh
pip install -r requirement.txt
```

8. Starting the backend server
```sh
python app.py 
```
9. Making a public server using ngrok
- Open another terminal for creating public server
- Move to the project directory 
- Create virtual environment as above
- start the server which will act as a public server for localhost 5000 


```sh
ngrok http 5000
```
## Team Members

* Jainil Shah 
* Abhinav Gupta 
* Adit Alware 
