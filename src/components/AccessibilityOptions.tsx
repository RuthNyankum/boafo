// import { useState } from "react";
// import { FaWheelchair } from "react-icons/fa";
// import { FaEarDeaf, FaEyeLowVision } from "react-icons/fa6";
// import convertor from "../utils/convertor";

// const AccessibilityOptions = () => {
//   const [openSection, setOpenSection] = useState<number | null>(null);
//   const [image, setImage] = useState<string>("");
//   const [ocrResult, setOcrResult] = useState<string>("");
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [selectedLanguage, setSelectedLanguage] = useState<string>("eng");

//   const toggleSection = (section: number) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   const captureScreenshotAndProcessOCR = async () => {
//     chrome.runtime.sendMessage({ action: "captureTab" }, async (response) => {
//       if (response?.screenshotUrl) {
//         setImage(response.screenshotUrl);
//         try {
//           setIsProcessing(true);
//           const text = await convertor(response.screenshotUrl, selectedLanguage);
//           setOcrResult(text);
//           readAloud(text);
//         } catch (error) {
//           console.error("Error during OCR processing:", error);
//           alert("An error occurred during OCR processing.");
//         } finally {
//           setIsProcessing(false);
//         }
//       } else {
//         console.error("Failed to capture screenshot.");
//         alert("Failed to capture screenshot.");
//       }
//     });
//   };

//   const readAloud = (text: string) => {
//     if (!("speechSynthesis" in window)) {
//       alert("Text-to-speech is not supported in this browser.");
//       return;
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = selectedLanguage === "eng" ? "en-US" : selectedLanguage;
//     speechSynthesis.speak(utterance);
//   };

//   const interfaceResize = () => {
//     document.body.style.zoom = "120%"; // Example resize
//     alert("Interface resized for accessibility.");
//   };

//   const options = [
//     {
//       title: "Visual Impairment",
//       description: "Capture image, extract text, and read aloud",
//       icon: FaEyeLowVision,
//       action: captureScreenshotAndProcessOCR,
//     },
//     {
//       title: "Hearing Impairment",
//       description: "Speech-to-text feature",
//       icon: FaEarDeaf,
//       action: () => alert("Speech-to-text is currently under development."),
//     },
//     {
//       title: "Physical Disability",
//       description: "Resizable interfaces",
//       icon: FaWheelchair,
//       action: interfaceResize,
//     },
//   ];

//   const langOptions = [
//     { lang: "English", value: "eng" },
//     { lang: "Twi", value: "twi" },
//     { lang: "Ga", value: "ga" },
//     { lang: "Fafra", value: "fafra" },
//   ];

//   return (
//     <div className="p-14 bg-white rounded-lg shadow-lg w-full md:w-2/3 mx-auto">
//       {image && (
//         <img
//           src={image}
//           alt="Captured Screenshot"
//           className="mb-6 w-full rounded-md"
//         />
//       )}
//       {isProcessing && <p>Processing image... Please wait.</p>}
//       {ocrResult && (
//         <p className="mt-4 text-gray-700">Extracted Text: {ocrResult}</p>
//       )}

//       {options.map((item, index) => (
//         <div key={index} className="mb-4 border rounded-lg overflow-hidden">
//           <button
//             onClick={() => {
//               toggleSection(index);
//               item.action();
//             }}
//             className="w-full flex justify-between items-center p-6 text-2xl font-bold bg-gray-100 hover:bg-gray-200 focus:outline-none"
//             aria-expanded={openSection === index}
//             aria-controls={`section-${index}`}
//           >
//             <div className="flex items-center gap-6">
//               <div className="bg-white p-4 rounded-full">
//                 <item.icon className="text-5xl text-black" />
//               </div>
//               <span className="text-2xl">{item.title}</span>
//             </div>
//             <span className="text-2xl">
//               {openSection === index ? "▲" : "▼"}
//             </span>
//           </button>

//           {openSection === index && (
//             <div className="p-6 bg-gray-50 text-xl text-gray-700">
//               {item.description}
//             </div>
//           )}
//         </div>
//       ))}

//       <div className="mt-6 flex justify-end">
//         <div className="bg-gray-100 rounded-lg shadow-md p-3 w-fit">
//           <select
//             id="language"
//             className="bg-gray-100 text-lg focus:outline-none"
//             onChange={(e) => setSelectedLanguage(e.target.value)}
//           >
//             {langOptions.map((option, index) => (
//               <option key={index} value={option.value}>
//                 {option.lang}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccessibilityOptions;
