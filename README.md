[[ Copyright Roy Wierer (Seda145) ]]
https://nl.linkedin.com/in/roy-wierer-68643a9b 

***

This browser application is a tool to help students with studying, by simulating an exam.
This application should not be used for actual exams, as all answers can be accessed by students.

***

To use it: 
1. Download the [latest release](https://github.com/Seda145/Exam/releases). Unzip it if you received a zip file.
2. Open Exam.html in your web browser.

***

This is what you should see on the Configuration page:

***

![afbeelding](https://github.com/Seda145/Exam/assets/30213433/c6b38eeb-811d-4a34-b010-1c01fbc6189b)

***

The application asks you for a "Lessons file". An example file is provided with this application:

![afbeelding](https://github.com/Seda145/Exam/assets/30213433/07b96d80-5a6a-4a1d-902b-de458b2f75db)

Preferrably your teacher should write this file and share it with students. It is written in a specific format in a text editor like Notepad (or a more json friendly editor). When you are done you can validate the file format using [JSONLint](https://jsonlint.com/). 

***

Once you have selected a valid file you can further configure your experience or start your exam directly. 
This is what you will see on the "My Exam" page, using the example json file:

***

![afbeelding](https://github.com/Seda145/Exam/assets/30213433/f9e0fd69-3620-4256-bb40-53fbe41c87d1)

***

At any time you will be able to see the current results of your test, by clicking on the "My Results" button. This will not end your exam. 

***

![afbeelding](https://github.com/Seda145/Exam/assets/30213433/c30904c6-3ca8-4840-aad8-a51a9faf2063)


***

While viewing your results, your current score is displayed among other information, like the amount of questions you answered and the time you have left until the data of the real exam. 

Your answers are colored.
1. Green means a correct answer.
2. Blue means you missed a correct answer.
3. Red means your answer is incorrect.

The teacher can write a note on every question which will be visible while you review your results. This is a powerful way to add information or context without cluttering the exam process.

***

Good luck and enjoy!

***

Tips:

1. The release packs css / js dependencies into Exam.html so it can be used with browsers on mobile devices.
2. Answers to questions are shuffled if they are not literal "True / False" answers.
3. The StartDate and EndDate fields in your JSON can be used to visualize how many days you have left to study for the actual exam.
4. The "Note" field in your JSON will be displayed when viewing your results. Write additional information here to explain why answers are correct or not.
5. After completing the JSON input field and before submitting step 1, the exam experience can be tuned on the "Finalize" panel. 
6. The app automatically displays checkbox inputs for questions with multiple right answers. Note that if you write 2 correct answers, 0 wrong answers, the user might estimate both checkboxes on the question equal correct answers. Consider reformatting such questions.
7. "Valid" questions contain answers in a valid format. They can optionally be shown if invalid and will be logged if not shown. A question is valid when:
	- It has more than 1 right answers (checkbox type).
	- It has 1 right answer, 1 or more wrong answers (Radio type).


