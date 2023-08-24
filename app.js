/**[[ Copyright Roy Wierer (Seda145) ]]**/


const App = (() => {

	const UIUtils = (() => {

		/* Functions */

		const _UpdateVisibility = function(InElem, InbShow) {
			if (!InElem) {
				console.log("UIUtils.UpdateVisibility: invalid InElem.");
				return;
			}
			if (InbShow) {
				InElem.classList.remove("hide");
			}
			else {
				InElem.classList.add("hide");
			}
		};

		/* Public */
		
		return {
			/* Functions */
			UpdateVisibility : _UpdateVisibility,
		};
		
	})();


	const MathUtils = (() => {
		/* Functions */

		const _Random = function() {
			// TODO seedable math generator
			return Math.random();
		}

		const _GetRandomInteger = function(InMin, InMax) {
			return Math.floor(MathUtils.Random() * (InMax - InMin + 1)) + InMin;
		}

		/* Public */

		return {
			/* Functions */
			Random : _Random,
			GetRandomInteger : _GetRandomInteger,
		};

	})();

	
	const StringUtils = (() => {
		const _StripEmptyNewLines = function(InString) {
			return InString.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "\r\n");
		}

		const _StripHTML = function(InString) {
			return InString.replace(/<\/?[^>]+(>|$)/g, "");
		};

		/* Public */
		
		return {
			/* Functions */
			StripEmptyNewLines : _StripEmptyNewLines, 
			StripHTML : _StripHTML, 
		};
		
	})();
	

	const CreationForm = (() => {
		/* Elements */

		let _eCreationForm;
		let _eTextareaCreationInput;
		let _eQuestionFieldsWrap;
		// Injection buttons
		let _eButtonInjectFile;
		
		/* Functions */

		const _IsValid = function() {
			if (!_eCreationForm 
				|| !_eTextareaCreationInput
				|| !_eQuestionFieldsWrap
				// Injection buttons
				|| !_eButtonInjectFile
				) {
				console.log("invalid form element(s).");
				return false;
			}
			return true;
		};

		const _SetElementVariables = function() {
			_eCreationForm = document.getElementById("creation-form");
			_eTextareaCreationInput = document.getElementById("textarea-creation-input");
			_eQuestionFieldsWrap = document.getElementById("question-fields-wrap");
			// Injection buttons
			_eButtonInjectFile = document.getElementById("creation-form-button-inject-file");
		};

		const _Register = function() {
			_SetElementVariables();
			if (!_IsValid()) {
				return;
			}

			// Override form submit.
			_eCreationForm.addEventListener(
				"submit",
				function (e) {
					e.preventDefault();

					// Just grab the value directly from the textarea, no need to process the form itself.
					const json = JSON.parse(_eTextareaCreationInput.value);

					console.log("Retrieved data from form:");
					console.log(json);

					// Empty any present questions on the question form, since they will be created from the new data.
					_eQuestionFieldsWrap.innerHTML = "";
					let newHTML = '';

					let questionIndex = 0;
					for (const questionX of json.Questions) {
						newHTML += '<fieldset class="fieldstyle">';

						const legend = '<legend>' + StringUtils.StripHTML(questionX.Question) + '</legend>';
						newHTML += legend;

						const answers = questionX.RightAnswers.concat(questionX.WrongAnswers);
						const inputType = questionX.RightAnswers.length > 1 ? 'checkbox' : 'radio';

						let answerIndex = 0;
						for (const answerX of answers) {
							newHTML += '<div class="row"><div class="col-12">';

							const answerID = 'radio-question-' + questionIndex + '-answer-' + answerIndex;
							const answerType = questionX.RightAnswers.includes(answerX) ? 'right-answer' : 'wrong-answer';

							const answerString = '<input type="' + inputType + '" id="' + answerID + '" name="question-' + questionIndex + '-answer" class="' + answerType +'" value="' + answerIndex + '"></input>';
							newHTML += answerString;
							const answerlabel = '<label for="' + answerID + '">' + StringUtils.StripHTML(answerX) + '</label>';
							newHTML += answerlabel;

							newHTML += '</div></div>';
							answerIndex++;
						}

						newHTML += '</fieldset>';
						questionIndex++;
					}

					_eQuestionFieldsWrap.insertAdjacentHTML('afterbegin', newHTML);

					Navigation.NavigateTo(1);

					return false;
				},
				false
			);

			// Bind injection button functionality.

			_eButtonInjectFile.addEventListener("change", function() {
				if (_eButtonInjectFile.files.length == 0) {
					return;
				}
				const selectedFile = _eButtonInjectFile.files[0];

				let fileReader = new FileReader();
				fileReader.onload = function(e) {
					_eTextareaCreationInput.value = e.target.result;
				};
				fileReader.readAsText(selectedFile);

			}); 
		};
		
		/* Public */
		
		return {
		  /* Functions */
		  IsValid : _IsValid,
		  Register : _Register
		};
	
	})();


	const QuestionForm = (() => {
		/* Elements */

		let _eQuestionForm;
		let _eQuestionFieldsWrap;
		
		/* Functions */

		const _IsValid = function() {
			if (!_eQuestionForm 
				|| !_eQuestionFieldsWrap
				) {
				console.log("invalid form element(s).");
				return false;
			}
			return true;
		};

		const _SetElementVariables = function() {
			_eQuestionForm = document.getElementById("question-form");
			_eQuestionFieldsWrap = document.getElementById("question-fields-wrap");
		};

		const _Register = function() {
			_SetElementVariables();
			if (!_IsValid()) {
				return;
			}

			// Override form submit.
			_eQuestionForm.addEventListener(
				"submit",
				function (e) {
					e.preventDefault();
					const formData = new FormData(_eQuestionForm);

					// DOSTUFF
					console.log("Question form posts data:");
					console.log(formData);

					Navigation.NavigateTo(2);

					return false;
				},
				false
			);
		};
		
		/* Public */
		
		return {
			/* Elements */
			QuestionFieldsWrap : _eQuestionFieldsWrap,
			/* Functions */
			IsValid : _IsValid,
			Register : _Register
		};
	
	})();

	
	const Navigation = (() => {
		/* Elements */

		let _eTabs;
		let _eCreationContent;
		let _eQuestionContent;

		/* Functions */

		const _IsValid = function() {
			if (!_eTabs
				|| !_eCreationContent
				|| !_eQuestionContent
				) {
				console.log("invalid navigation element(s).");
				return false;
			}
			return true;
		};

		const _SetElementVariables = function() {
			_eTabs = document.getElementById("tabs");
			_eCreationContent = document.getElementById("creation-content");
			_eQuestionContent = document.getElementById("question-content");
		};

		const _Register = function() {
			_SetElementVariables();
			if (!_IsValid()) {
				return false;
			}

			// Listen to when a tab is clicked. On click, navigate to its content id.

			_eTabs.querySelectorAll(".tab").forEach(function (InElemX) {
				InElemX.addEventListener(
					"click",
					function (e) {
						_NavigateTo(e.target.dataset.contentid);
					}
				);
			});
		};

		const _NavigateTo = function(InContentId) {
			switch (Number(InContentId)) {
				case 0:
					UIUtils.UpdateVisibility(_eCreationContent, true);
					UIUtils.UpdateVisibility(_eQuestionContent, false);
					_eQuestionContent.classList.remove("show-results");
				break;
				case 1:
					UIUtils.UpdateVisibility(_eCreationContent, false);
					UIUtils.UpdateVisibility(_eQuestionContent, true);
					_eQuestionContent.classList.remove("show-results");

				break;
				case 2:
					UIUtils.UpdateVisibility(_eCreationContent, false);
					UIUtils.UpdateVisibility(_eQuestionContent, true);
					_eQuestionContent.classList.add("show-results");
				break;
				default:
					console.log("Navigation error, this contentId is not used.");
					return;
			}

			let activeTab = _eTabs.querySelector(".tab.active");
			if (activeTab) {
				activeTab.classList.remove("active");
			}
			let newTab = _eTabs.querySelector('.tab[data-contentid="' + InContentId + '"]');
			if (newTab) {
				newTab.classList.add("active");
			}

			console.log("Navigated to InContentId: " + InContentId);
		};

		/* Public */

		return {
			/* Functions */
			IsValid : _IsValid,
			Register : _Register,
			NavigateTo : _NavigateTo,
		};

	})();


	/* Module */

	const _StartModule = (() => {
		// Register the forms
		CreationForm.Register();
		QuestionForm.Register();
		// Register the navigation module.
		Navigation.Register();
		// Initial navigation.
		Navigation.NavigateTo(0);
	})();
  
})();
