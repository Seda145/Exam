[[ Copyright Roy Wierer (Seda145) ]]
https://nl.linkedin.com/in/roy-wierer-68643a9b 


Using the application:

This browser application is a tool to help students with studying, by simulating an exam.
This application should not be used for actual exams, as all answers can be accessed by students.
To use it, open Exam.html in your web browser.
Students write questions and answers in JSON format in step 1, answer their questions in step 2 and view their result (score) in step 3.
A template for the JSON file is included "Lessons.json".


Tips:

1. For use on mobile devices it might be necessary to merge the HTML file with its css and javascript dependencies (inside the html file within <style> and <script> tags) for your browser to load them.
2. If you can't submit your JSON to continue to step 2, your JSON format is invalid. Try using a JSON linter like https://jsonlint.com/
3. The StartDate and EndDate fields in your JSON can be used to visualize how many days you have left to study for the actual exam.
4. After completing the JSON input field and before submitting step 1, the exam experience can be tuned on the "Finalize" panel. 
The checkbox "Show invalid questions" is used to display questions with no valid answers. I find this useful when I add homework questions to which I don't have the answer data yet.