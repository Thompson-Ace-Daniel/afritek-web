import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // Function to mount the widget
    const initTranslate = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr,zh-CN,ar,es",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element",
        );
      }
    };

    // Attach listener for RTL layout switching (Arabic)
    const handleLanguageChange = (e) => {
      if (e.target && e.target.classList.contains("goog-te-combo")) {
        const currentLang = e.target.value;
        if (currentLang === "ar") {
          document.documentElement.setAttribute("dir", "rtl");
        } else {
          document.documentElement.setAttribute("dir", "ltr");
        }
      }
    };
    document.addEventListener("change", handleLanguageChange);

    // Check if script is already present on the page
    let script = document.getElementById("google-translate-script");

    if (!script) {
      script = document.createElement("script");
      script.id = "google-translate-script";
      script.type = "text/javascript";
      script.src = "https://translate.google.com/translate_a/element.js";
      script.async = true;

      // RUN INIT ONCE THE SCRIPT FILE FINISHES DOWNLOADING
      script.onload = () => {
        initTranslate();
      };

      document.body.appendChild(script);
    } else {
      // If script exists (e.g. navigation or hot reload), run init immediately
      initTranslate();
    }

    return () => {
      document.removeEventListener("change", handleLanguageChange);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 min-h-[38px]">
      <div id="google_translate_element" />
    </div>
  );
}
