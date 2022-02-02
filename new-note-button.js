  ///////////////////////
 // Utility Functions //
///////////////////////

function runCommand(commandId, skipDialog = true, args = []) {
	// Create a protocol URL that will run the requested command
	let url = `notable://command/${commandId}`

	args.forEach((arg) => {
		// Add any command arguments to the URL
		const stringifiedArg = encodeURIComponent(typeof arg === "string" ? arg : JSON.stringify(arg))
		url += "/" + "%5B%22" + stringifiedArg + "%22%5D"
	})

	// Tell Notable to navigate to/open our URL
	window.location.href = url

	// Deal with any confirmation dialogues that Notable gives us
	// Also be sure not to activate any other dialogues
	// Allows 110ms for the dialogue to actually appear
	if (!skipDialog) {
		setTimeout(() => {
			if ($(".dialog p b").text() === url) {
				// Traverses the DOM to find the button that we want
				const confirmationButton = $(".dialog p b")
					.parentsUntil("body")
					.last()
					.find(".card-footer .button:last-child")
				confirmationButton.trigger("spointertap")
			}
		}, 110)
	}
}

function select(element) {
	return document.querySelector(element)
}

function exists(input) {
	let query = input
	if (typeof query === "string") {
		query = select(query)
	}
	if (query != null && document.body.contains(query)) {
		return true
	} else {
		return false
	}
}

  ///////////////////////
 //  New Note Button  //
///////////////////////

function createNote() {
	const activeTag = select(".sidebar").querySelector(".active")
	const tagName = activeTag.getAttribute("data-id")
	console.log(tagName)
	if (tagName != "All Notes") {
		runCommand("tag.new.childNote", true, [tagName])
	} else {
		runCommand("tag.new.childNote")
	}
}

function newNoteButton() {
	// Checking if the appropriate part of the DOM is loaded, and that we aren't repeating our button
	if (exists(".panel") 
    &&  exists(select(".panel").querySelector(".list-item")) 
    && !exists(".new-note-button")) {
		const button = document.createElement("button")
		select(".panel").appendChild(button)

		button.innerHTML = "New Note"
		button.classList.add("new-note-button")
		button.classList.add("button")
		button.classList.add("bordered")
		button.onclick = createNote
	}
}

  ///////////////////////
 // Mutation Observer //
///////////////////////
// This allows us to run functions only when elements actually exist.

let observer = new MutationObserver((mutations) => {
	// Checking for changes to the DOM
	mutations.forEach((mutation) => {
		if (!mutation.addedNodes) return
		for (let i = 0; i < mutation.addedNodes.length; i++) {
			// We run DOM-dependent code here.
			// Checks for specific elements existing are done inside the function.
			newNoteButton()

			let node = mutation.addedNodes[i]
		}
	})
})

observer.observe(document.body, {
	childList: true,
	subtree: true,
	attributes: false,
	characterData: false,
})
