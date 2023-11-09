/**[[ Copyright Roy Wierer (Seda145) ]]**/


class UIUtils {

	/* Functions */

	static updateVisibility(inElem, bInShow) {
		if (!inElem) {
			console.log("UIUtils.updateVisibility: invalid inElem.");
			return;
		}
		if (bInShow) {
			inElem.classList.remove("hide");
		}
		else {
			inElem.classList.add("hide");
		}
	}
}


class StringUtils {
	static stripHTML(inString) {
		return inString.replace(/<\/?[^>]+(>|$)/g, "");
	}
}


class Cache {
	constructor() {
		// State
		this.JSON = {};
		this.JSONFileReader = new FileReader();
		// Events
		this.onJSONUpdated = new Event("cache-on-json-updated");
		// Elements
		this.eTabs = document.getElementById("tabs");
		this.eCreationContent = document.getElementById("creation-content");
		this.eCreationForm = document.getElementById("creation-form");
		this.eTextareaCreationInput = document.getElementById("textarea-creation-input");
		this.eQuestionForm = document.getElementById("question-form");
		this.eQuestionContent = document.getElementById("question-content");
		this.eQuestionFieldsWrap = document.getElementById("question-fields-wrap");
		this.eQuestionInteractionBlocker = document.getElementById("question-interaction-blocker");
		this.eProgressBar = document.getElementById("progress-bar");
		this.eProgressAnsweredQuestionsCounter = document.getElementById("progress-answered-questions-counter");
		this.eProgressTotalScore = document.getElementById("progress-total-score");
		this.eProgressScoreToTen = document.getElementById("progress-score-to-ten");
		// this.eProgressStartDate = document.getElementById("progress-start-date");
		// this.eProgressEndDate = document.getElementById("progress-end-date");
		this.eProgressDateBarInner = document.getElementById("progress-date-bar-inner");
		this.eProgressDateBarText = document.getElementById("progress-date-bar-text");
		this.eButtonInjectFile = document.getElementById("creation-form-button-inject-file");
		this.eNumberStartAtLesson = document.getElementById("creation-form-number-start-at-lesson");
		this.eNumberEndAtLesson	= document.getElementById("creation-form-number-end-at-lesson");

		this.debugValidity();

		// Setup

		this.eTextareaCreationInput.addEventListener("change", () => {
			this.updateJSONCache();
		}); 

		this.eTextareaCreationInput.addEventListener("input", () => {
			this.updateJSONCache();
		}); 

		this.updateJSONCache();
	}

	debugValidity() {
		const bIsValid = (
			this.eTabs
			&& this.eCreationContent
			&& this.eCreationForm 
			&& this.eTextareaCreationInput
			&& this.eQuestionForm 
			&& this.eQuestionContent
			&& this.eQuestionFieldsWrap
			&& this.eQuestionInteractionBlocker
			&& this.eProgressBar
			&& this.eProgressAnsweredQuestionsCounter
			&& this.eProgressTotalScore
			&& this.eProgressScoreToTen
			// && this.eProgressStartDate
			// && this.eProgressEndDate
			&& this.eProgressDateBarInner
			&& this.eProgressDateBarText
			&& this.eButtonInjectFile
			&& this.eNumberStartAtLesson
			&& this.eNumberEndAtLesson
		);

		if (!bIsValid) {
			console.log("Elements are invalid!");
		}
	}

	updateJSONCache() {
		try {
			this.JSON = JSON.parse(this.eTextareaCreationInput.value);
			document.dispatchEvent(this.onJSONUpdated);
			console.log("Updated json cache.");
		} 
		catch (error) {
			console.error(error);
		}
	}
}


class CreationForm {
	constructor() {
		document.addEventListener(
			"cache-on-json-updated",
			(e) => {
				this.updateParameterWidgetsToJSON();
			},
			false,
		);

		// Override form submit.
		App.Cache.eCreationForm.addEventListener(
			"submit",
			(e) => {
				e.preventDefault();

				const formData = new FormData(e.target);
				const bShowQuestionsWithInvalidAnswers = formData.get("creation-show-questions-with-invalid-answers") === 'on';
				const bShuffleQuestions = formData.get("creation-shuffle-questions") === 'on';
				const bMixLessons = formData.get("creation-mix-lessons") === 'on';
				
				// Empty any present questions on the question form, since they will be created from the new data.
				App.Cache.eQuestionFieldsWrap.innerHTML = "";

				let lessons = [];
				const startAtLesson = parseInt(App.Cache.eNumberStartAtLesson.value);
				const endAtLesson = parseInt(App.Cache.eNumberEndAtLesson.value);

				{
					let lessonID = 1;
					for (const lessonX of App.Cache.JSON.Lessons) {
						if (lessonID < startAtLesson) {
							lessonID++;
							continue;
						}
						if (lessonID > endAtLesson) {
							break;
						}
						lessons.push(lessonX);
						lessonID++;
					}
				}

				if (bMixLessons) {
					// console.log("Mixing lessons.");
					let mixedLesson = {};
					mixedLesson.Lesson = "Mix";
					mixedLesson.Questions = [];
					for (const lessonX of lessons) {
						mixedLesson.Questions = mixedLesson.Questions.concat(lessonX.Questions);
					}

					lessons = [];
					lessons.push(mixedLesson);
				}

				let bHasAnyLessonToShow = false;
				let newHTML = '';

				let lessonID = 1;
				for (const lessonX of lessons) {
					let bLessonHasAnyQuestionsToShow = false;
					const lessonTitle = StringUtils.stripHTML(lessonX.Lesson);
					let questions = lessonX.Questions;

					if (bShuffleQuestions) {
						questions.sort(() => Math.random() > 0.5);
						// console.log("Shuffling questions.");
					}

					// console.log("Processed questions:");
					// console.log(questions);

					let questionID = 1;
					let lessonHTML = "";

					for (const questionX of questions) {
						// Default to an invalid question, we whitelist.
						let bIsQuestionValidX = false;
						if (questionX.RightAnswers.length > 1) {
							// With multiple correct answers missing one would count as a mistake, so we don't need a wrong answer.
							bIsQuestionValidX = true;
						}
						else if (questionX.RightAnswers.length == 1 && questionX.WrongAnswers.length > 0) {
							// There must be at least one right answer and one (or more) wrong.
							bIsQuestionValidX = true;
						}

						if (!bIsQuestionValidX) {
							if (!bShowQuestionsWithInvalidAnswers) {
								console.log("skipped question with invalid answers: " + questionX.Question);
								continue;
							}
						}

						bLessonHasAnyQuestionsToShow = true;

						lessonHTML += '<fieldset class="fieldstyle">';

						const legend = '<legend>' + questionID + '.</legend>';
						lessonHTML += legend;

						const Description = '<p class="question-description">' + StringUtils.stripHTML(questionX.Question) + '</p>';
						lessonHTML += Description;

						let answers = []; 

						// If this is a "True or False" question. Always make True appear first to not disorient the reader.
						if (questionX.RightAnswers.length == 1
							&& questionX.WrongAnswers.length == 1
							) {
							if (questionX.RightAnswers[0] == "True") {
								answers.push(questionX.RightAnswers[0]);
								answers.push(questionX.WrongAnswers[0]);
							}
							else {
								answers.push(questionX.WrongAnswers[0]);
								answers.push(questionX.RightAnswers[0]);
							}
						}

						// Otherwise merge both arrays and shuffle.
						if (answers.length == 0) {
							answers = questionX.RightAnswers.concat(questionX.WrongAnswers);
							answers.sort(() => Math.random() > 0.5);
						}
						
						const inputType = questionX.RightAnswers.length > 1 ? 'checkbox' : 'radio';

						let answerIndex = 0;
						for (const answerX of answers) {
							lessonHTML += '<div class="row"><div class="col-12 question-answer-wrap">';

							const answerID = 'radio-lesson-' + lessonID + '-question-' + questionID + '-answer-' + answerIndex;
							const answerType = questionX.RightAnswers.includes(answerX) ? 'right-answer' : 'wrong-answer';

							const answerString = '<input type="' + inputType + '" id="' + answerID + '" name="lesson-' + lessonID + '-question-' + questionID + '-answer" class="' + answerType +'" value="' + answerIndex + '"></input>';
							lessonHTML += answerString;
							const answerlabel = '<label for="' + answerID + '">' + StringUtils.stripHTML(answerX) + '</label>';
							lessonHTML += answerlabel;

							lessonHTML += '</div></div>';
							answerIndex++;
						}

						if (questionX.Note) {
							lessonHTML += '<p class="result-answer-note">Note: ' + questionX.Note + '</p>';
						}

						lessonHTML += '</fieldset>';
						questionID++;
					}

					if (bLessonHasAnyQuestionsToShow) {
						newHTML += '<div class="question-lesson-wrap">';
						newHTML += '<h4 class="question-lesson-title">' + lessonTitle + '</h4>';
						newHTML += lessonHTML;
						newHTML += "</div>";

						bHasAnyLessonToShow = true;
					}
					
					lessonID++;
				}

				if (!bHasAnyLessonToShow) {
					console.log("Aborting request, there is nothing to show.");
					return false;
				}

				App.Cache.eQuestionFieldsWrap.insertAdjacentHTML('afterbegin', newHTML);

				App.Navigation.navigateTo(1);
				window.scrollTo({top: 0, behavior: 'smooth'})
				App.Navigation.updateTabVisibility();

				return false;
			},
			false
		);

		// Bind injection button functionality.

		App.Cache.eButtonInjectFile.addEventListener("change", () => {
			if (App.Cache.eButtonInjectFile.files.length == 0) {
				return;
			}
			const selectedFile = App.Cache.eButtonInjectFile.files[0];

			App.Cache.JSONFileReader.onload = (e) => {
				App.Cache.eTextareaCreationInput.value = e.target.result;
				let changeEvent = new Event('change', { bubbles: true });
				App.Cache.eTextareaCreationInput.dispatchEvent(changeEvent);
			};
			App.Cache.JSONFileReader.readAsText(selectedFile);
		}); 

		// Update parameters when something relevant changes.

		App.Cache.eNumberStartAtLesson.addEventListener("input", () => {
			// Clamp between min (1) and max (amount of lessons);
			const maxLen = App.Cache.JSON.Lessons ? App.Cache.JSON.Lessons.length : 1;
			App.Cache.eNumberStartAtLesson.value = Math.max(1, Math.min(maxLen, App.Cache.eNumberStartAtLesson.value));
			// Drag along eNumberEndAtLesson.
			if (parseInt(App.Cache.eNumberEndAtLesson.value) < parseInt(App.Cache.eNumberStartAtLesson.value)) {
				App.Cache.eNumberEndAtLesson.value = App.Cache.eNumberStartAtLesson.value;
			}
		}); 

		App.Cache.eNumberEndAtLesson.addEventListener("input", () => {
			// Clamp between min (1) and max (amount of lessons);
			const maxLen = App.Cache.JSON.Lessons ? App.Cache.JSON.Lessons.length : 1;
			App.Cache.eNumberEndAtLesson.value = Math.max(1, Math.min(maxLen, App.Cache.eNumberEndAtLesson.value));
			// Drag along eNumberStartAtLesson.
			if (parseInt(App.Cache.eNumberStartAtLesson.value) > parseInt(App.Cache.eNumberEndAtLesson.value)) {
				App.Cache.eNumberStartAtLesson.value = App.Cache.eNumberEndAtLesson.value;
			}
		}); 
	}


	updateParameterWidgetsToJSON() {
		App.Cache.eNumberStartAtLesson.value = 1;
		const maxLen = App.Cache.JSON.Lessons ? App.Cache.JSON.Lessons.length : 1;
		App.Cache.eNumberEndAtLesson.value = Math.max(1, maxLen);
	}
}


class QuestionForm {
	constructor() {
		// Override form submit.
		App.Cache.eQuestionForm.addEventListener(
			"submit",
			(e) => {
				e.preventDefault();
				const formData = new FormData(Cache.eQuestionForm);

				console.log("Question form posts data:");
				console.log(formData);

				App.Navigation.navigateTo(2);

				return false;
			},
			false
		);
	}
}


class ResultsOverlay {
	constructor() {
		// When the question interaction blocker is clicked, navigate from results back to questions (it unblocks interaction, which was blocked to show results.).
		App.Cache.eQuestionInteractionBlocker.addEventListener("click", () => {
			App.Navigation.navigateTo(1);
		}); 
	}

	showResults() {
		App.Cache.eQuestionContent.classList.add("show-results");
		App.Cache.eQuestionInteractionBlocker.classList.add("active");
		App.Cache.eProgressBar.classList.add("active");
	}

	hideResults() {
		App.Cache.eQuestionContent.classList.remove("show-results");
		App.Cache.eQuestionInteractionBlocker.classList.remove("active");
		App.Cache.eProgressBar.classList.remove("active");
	}

	updateProgressWidgets() {
		const questionFieldSets = App.Cache.eQuestionFieldsWrap.querySelectorAll("fieldset");
		const questionAmount = questionFieldSets.length;
		if (questionAmount == 0) {
			console.log("can't show answers for 0 questions");
			return;
		}

		// Update dates

		let startDate = new Date(App.Cache.JSON.StartDate);
		const endDate = new Date(App.Cache.JSON.EndDate);
		if (startDate > endDate) {
			console.log("Clamped start date to be before end date.");
			startDate = endDate;
		}
		let currentDate = new Date();
		if (currentDate < startDate) {
			currentDate = startDate;
			console.log("Clamped current date to be after start date.");
		}
		if (currentDate > endDate) {
			console.log("Clamped current date to be before end date.");
			currentDate = endDate;
		}

		const daysTowardsStart = Math.abs(startDate.getTime() - currentDate.getTime()) / 86400000;
		const daysTowardsEnd = Math.abs(endDate.getTime() - currentDate.getTime()) / 86400000;

		// Percentage towards the end date with 0 decimals.
		const dateBarPercentage = (daysTowardsStart / (daysTowardsStart + daysTowardsEnd) * 100).toFixed(0);

		// App.Cache.eProgressStartDate.innerHTML = startDate.toDateString();
		// App.Cache.eProgressEndDate.innerHTML = endDate.toDateString();
		App.Cache.eProgressDateBarInner.style.width = dateBarPercentage + "%";
		App.Cache.eProgressDateBarText.innerHTML = "Started " + daysTowardsStart.toFixed(0) + " days ago, " + daysTowardsEnd.toFixed(0) + " days left.";

		// Gather score data.

		let totalScore = 0;
		let answeredQuestions = 0;
		for (const questionFieldsetX of questionFieldSets) {
			if (questionFieldsetX.querySelector("input:checked")) {
				answeredQuestions++;
			}
			else {
				// No input was checked, counting as a mistake.
				continue;
			}

			if (questionFieldsetX.querySelector("input.wrong-answer:checked")
				|| questionFieldsetX.querySelector("input.right-answer:not(:checked)")
				) {
				// A wrong input was checked, counting as a mistake.
				continue;
			}

			totalScore++;
		}

		// Update the widgets.

		App.Cache.eProgressAnsweredQuestionsCounter.innerHTML = '<p>Answered:</br>' + answeredQuestions + ' / ' + questionAmount + '</p>';
		App.Cache.eProgressTotalScore.innerHTML = '<p>Score:</br>' + totalScore + ' / ' + questionAmount + '</p>';
		let scoreToTen = (totalScore / questionAmount * 10);
		// Round to 1 decimal:
		scoreToTen = +scoreToTen.toFixed(1);
		App.Cache.eProgressScoreToTen.innerHTML = '<p>Score:</br>' + scoreToTen + ' / 10</p>';
	}
}


class Navigation {
	constructor() {
		// Listen to when a tab is clicked. On click, navigate to its content id.
		App.Cache.eTabs.querySelectorAll(".tab").forEach((inElemX) => {
			inElemX.addEventListener(
				"click",
				(e) => {
					this.navigateTo(e.target.dataset.contentid);
				}
			);
		});
	}

	navigateTo(InContentId) {
		switch (Number(InContentId)) {
			case 0:
				// Navigate to question creation, do not show results.
				UIUtils.updateVisibility(App.Cache.eCreationContent, true);
				UIUtils.updateVisibility(App.Cache.eQuestionContent, false);
				App.ResultsOverlay.hideResults();
				break;
			case 1:
				// Navigate to questions, do not show results.
				UIUtils.updateVisibility(App.Cache.eCreationContent, false);
				UIUtils.updateVisibility(App.Cache.eQuestionContent, true);
				App.ResultsOverlay.hideResults();
				break;
			case 2:
				// Navigate to questions, show results.
				UIUtils.updateVisibility(App.Cache.eCreationContent, false);
				UIUtils.updateVisibility(App.Cache.eQuestionContent, true);
				App.ResultsOverlay.updateProgressWidgets();
				App.ResultsOverlay.showResults();
				break;
			default:
				console.log("Navigation error, this contentId is not used.");
				return;
		}

		let activeTab = App.Cache.eTabs.querySelector(".tab.active");
		if (activeTab) {
			activeTab.classList.remove("active");
		}
		let newTab = App.Cache.eTabs.querySelector('.tab[data-contentid="' + InContentId + '"]');
		if (newTab) {
			newTab.classList.add("active");
		}

		// console.log("Navigated to InContentId: " + InContentId);
	}

	updateTabVisibility() {
		const questionFieldSets = App.Cache.eQuestionFieldsWrap.querySelectorAll("fieldset");
		const questionAmount = questionFieldSets.length;
		if (questionAmount > 0) {
			App.Cache.eTabs.classList.remove("hide");
		}
		else {
			App.Cache.eTabs.classList.add("hide");
		}
	}
}

class MyApp {
	startModule() {
		// Cache
		this.Cache = new Cache();
		// Register the forms
		this.CreationForm = new CreationForm();
		this.QuestionForm = new QuestionForm();
		this.ResultsOverlay = new ResultsOverlay();
		// Initial navigation.
		this.Navigation = new Navigation();
		this.Navigation.navigateTo(0);
	}
}

const App = new MyApp();
App.startModule();