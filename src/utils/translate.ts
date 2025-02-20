export const translateText = (lang: string) => {
  // 'lang' here should be the value for translation, e.g. "fr" or "es"
  const translateElement = document.createElement("div");
  translateElement.id = "google_translate_element";
  document.body.prepend(translateElement);

  const styleElement = document.createElement("style");
  styleElement.textContent = `
    #google_translate_element, .skiptranslate {
      display: none;
    }
    body {
      top: 0 !important;
    }
  `;
  document.head.appendChild(styleElement);

  const script1 = document.createElement("script");
  script1.textContent = `
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: '${lang},en',
        autoDisplay: false
      }, 'google_translate_element');
      setTimeout(() => {
        const languageDropdown = document.querySelector("#google_translate_element select");
        if (languageDropdown) {
          languageDropdown.selectedIndex = 1;
          languageDropdown.dispatchEvent(new Event('change'));
        }
      }, 3000);
    }
  `;
  document.body.appendChild(script1);

  const script2 = document.createElement("script");
  script2.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(script2);
};
