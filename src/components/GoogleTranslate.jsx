import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    const SCRIPT_ID = "google-translate-script";

    window.googleTranslateElementInit = () => {
      if (
        window.google?.translate?.TranslateElement &&
        document.getElementById("google_translate_element")
      ) {
        if (document.querySelector(".goog-te-combo")) return;

        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr,zh-CN,ar,es",
            autoDisplay: false,
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element",
        );
      }
    };

    let script = document.getElementById(SCRIPT_ID);

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;

      document.body.appendChild(script);
    } else {
      window.googleTranslateElementInit();
    }

    const handleLanguageChange = (event) => {
      if (!event.target?.classList?.contains("goog-te-combo")) return;

      const language = event.target.value;

      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.body.dir = language === "ar" ? "rtl" : "ltr";
    };

    document.addEventListener("change", handleLanguageChange);

    return () => {
      document.removeEventListener("change", handleLanguageChange);
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="flex items-center w-full min-h-[38px]"
    />
  );
}
