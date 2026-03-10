"use client"

import { useEffect } from 'react'

const GoogleTranslate = () => {
    useEffect(() => {
        // Check if the script is already added to prevent duplicates on hot reloads
        if (!document.querySelector('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) {
            const script = document.createElement('script')
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            script.async = true
            document.body.appendChild(script)

            // Define the callback function globally so Google's script can call it
            window.googleTranslateElementInit = () => {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            autoDisplay: false,
                        },
                        'google_translate_element'
                    )
                }
            }
        }
    }, [])

    return (
        <div id="google_translate_element" className="hidden"></div>
    )
}

// Add the type declaration to the global window object to satisfy TypeScript
declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

export default GoogleTranslate
