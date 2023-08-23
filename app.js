/**[[ Copyright Roy Wierer (Seda145) ]]**/


const AppModule = (() => {


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


	const QuestionForm = (() => {
		/* Elements */

		let _eQuestionForm;
		
		/* Functions */

		const _IsValid = function() {
			if (!_eQuestionForm 
				) {
				console.log("invalid form element(s).");
				return false;
			}
			return true;
		};

		const _SetElementVariables = function() {
			_eQuestionForm = document.getElementById("question-form");
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

					return false;
				},
				false
			);
		};
		
		/* Public */
		
		return {
		  /* Functions */
		  IsValid : _IsValid,
		  Register : _Register
		};
	
	})();

	
	const Navigation = (() => {
		/* Elements */

		let _eTabs;
		let _eAnchorQuestions;

		/* Functions */

		const _IsValid = function() {
			if (!_eTabs
				|| !_eAnchorQuestions
				) {
				console.log("invalid navigation element(s).");
				return false;
			}
			return true;
		};

		const _SetElementVariables = function() {
			_eTabs = document.getElementById("tabs");
			_eAnchorQuestions = document.getElementById("anchor-questions");
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
			let eAnchor = null;
			switch (Number(InContentId)) {
				case 0:
					eAnchor = _eAnchorQuestions;
				break;
			}

			if (eAnchor == null) {
				console.log("Navigation error, eAnchor == null");
				return;
			}
			// console.log("Navigating to InContentId: " + InContentId);

			eAnchor.scrollIntoView({behavior: "smooth"});
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
		QuestionForm.Register();
		// Register the navigation module.
		Navigation.Register();
	})();
  
})();
