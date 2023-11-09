[[ Copyright Roy Wierer (Seda145) ]]
https://nl.linkedin.com/in/roy-wierer-68643a9b 


Using the application:

This browser application is a tool to help students with studying, by simulating an exam.
This application should not be used for actual exams, as all answers can be accessed by students.
To use it, open Exam.html in your web browser.


Instructions:

1. Questions are created in step 1 with JSON, answered in step 2 and answers are reviewed in step 3.
2. You can upload a JSON file into the app. Optimally you or a teacher creates and shares this file so it has to be written only once.
3. A template for the JSON file is included: "./Example/Lessons.json".
4. If you can't submit your JSON, it is invalid. Try using a JSON linter like https://jsonlint.com/ . Look at the browser console for logs.
5. For use on mobile devices it might be necessary to merge the HTML file with its css and javascript dependencies for your mobile browser to load them.
6. Answers to questions are shuffled if they are not literal "True / False" answers.
7. The StartDate and EndDate fields in your JSON can be used to visualize how many days you have left to study for the actual exam.
8. The "Note" field in your JSON will be displayed when viewing your results. Write additional information here to explain why answers are correct or not.
9. After completing the JSON input field and before submitting step 1, the exam experience can be tuned on the "Finalize" panel. 
10. The app automatically displays checkbox inputs for questions with multiple right answers. Note that if you write 2 correct answers, 0 wrong answers, the user might estimate both checkboxes on the question equal correct answers. Consider reformatting such questions.
11. "Valid" questions contain answers in a valid format. They can optionally be shown if invalid and will be logged if not shown. A question is valid when:
	- It has more than 1 right answers (checkbox type).
	- It has 1 right answer, 1 or more wrong answers (Radio type).



Creation of questions:

![Create_Questions](https://github.com/Seda145/Exam/assets/30213433/be123b48-e230-4c11-81f5-cce7b558f116)

Answering your questions:

![Answering_Questions](https://github.com/Seda145/Exam/assets/30213433/3107f8ff-3baa-4286-9b5c-67e635b0cc53)

Showing your results:

![Results_Questions](https://github.com/Seda145/Exam/assets/30213433/9c6879c8-ed85-4b52-8377-df1ac5560880)


