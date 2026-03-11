(function () {
    function clearValidationState(form) {
        var controls = form.querySelectorAll("input, textarea");
        controls.forEach(function (control) {
            control.classList.remove("is-invalid");
            control.classList.remove("is-valid");

            var next = control.nextElementSibling;
            if (next && next.classList.contains("invalid-feedback")) {
                next.remove();
            }
        });
    }

    function setInvalid(control, message) {
        control.classList.remove("is-valid");
        control.classList.add("is-invalid");

        var feedback = document.createElement("div");
        feedback.className = "invalid-feedback d-block";
        feedback.textContent = message;
        control.insertAdjacentElement("afterend", feedback);
    }

    function setValid(control) {
        control.classList.remove("is-invalid");
        control.classList.add("is-valid");
    }

    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateLoginForm(form) {
        var email = form.querySelector("#login-email");
        var password = form.querySelector("#login-password");
        var isValid = true;

        var emailValue = email.value.trim();
        var passwordValue = password.value.trim();

        if (!emailValue) {
            setInvalid(email, "Email-ul este obligatoriu.");
            isValid = false;
        } else if (!isEmail(emailValue)) {
            setInvalid(email, "Introdu un email valid.");
            isValid = false;
        } else {
            setValid(email);
        }

        if (!passwordValue) {
            setInvalid(password, "Parola este obligatorie.");
            isValid = false;
        } else if (passwordValue.length < 6) {
            setInvalid(password, "Parola trebuie să aibă minim 6 caractere.");
            isValid = false;
        } else {
            setValid(password);
        }

        return isValid;
    }

    function validateRegisterForm(form) {
        var firstName = form.querySelector("#register-firstname");
        var lastName = form.querySelector("#register-lastname");
        var email = form.querySelector("#register-email");
        var password = form.querySelector("#register-password");
        var confirmPassword = form.querySelector("#register-confirm-password");
        var isValid = true;

        if (!firstName.value.trim()) {
            setInvalid(firstName, "Prenumele este obligatoriu.");
            isValid = false;
        } else {
            setValid(firstName);
        }

        if (!lastName.value.trim()) {
            setInvalid(lastName, "Numele este obligatoriu.");
            isValid = false;
        } else {
            setValid(lastName);
        }

        var emailValue = email.value.trim();
        if (!emailValue) {
            setInvalid(email, "Email-ul este obligatoriu.");
            isValid = false;
        } else if (!isEmail(emailValue)) {
            setInvalid(email, "Introdu un email valid.");
            isValid = false;
        } else {
            setValid(email);
        }

        var passwordValue = password.value.trim();
        if (!passwordValue) {
            setInvalid(password, "Parola este obligatorie.");
            isValid = false;
        } else if (passwordValue.length < 6) {
            setInvalid(password, "Parola trebuie să aibă minim 6 caractere.");
            isValid = false;
        } else {
            setValid(password);
        }

        if (!confirmPassword.value.trim()) {
            setInvalid(confirmPassword, "Confirmarea parolei este obligatorie.");
            isValid = false;
        } else if (confirmPassword.value.trim() !== passwordValue) {
            setInvalid(confirmPassword, "Parolele nu coincid.");
            isValid = false;
        } else {
            setValid(confirmPassword);
        }

        return isValid;
    }

    function validateContactForm(form) {
        var name = form.querySelector("#contact-name");
        var email = form.querySelector("#contact-email");
        var message = form.querySelector("#contact-message");
        var isValid = true;

        if (!name.value.trim()) {
            setInvalid(name, "Numele este obligatoriu.");
            isValid = false;
        } else {
            setValid(name);
        }

        var emailValue = email.value.trim();
        if (!emailValue) {
            setInvalid(email, "Email-ul este obligatoriu.");
            isValid = false;
        } else if (!isEmail(emailValue)) {
            setInvalid(email, "Introdu un email valid.");
            isValid = false;
        } else {
            setValid(email);
        }

        var messageValue = message.value.trim();
        if (!messageValue) {
            setInvalid(message, "Mesajul este obligatoriu.");
            isValid = false;
        } else if (messageValue.length < 10) {
            setInvalid(message, "Mesajul trebuie să aibă minim 10 caractere.");
            isValid = false;
        } else {
            setValid(message);
        }

        return isValid;
    }

    function wireFormValidation(formId, validator) {
        var form = document.getElementById(formId);
        if (!form) {
            return;
        }

        form.setAttribute("novalidate", "novalidate");

        form.addEventListener("submit", function (event) {
            clearValidationState(form);
            var valid = validator(form);

            if (!valid) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        wireFormValidation("login-form", validateLoginForm);
        wireFormValidation("register-form", validateRegisterForm);
        wireFormValidation("contact-form", validateContactForm);
    });
})();
