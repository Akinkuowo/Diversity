"use client"

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function TranslationFixerContent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Google Translate replaces text nodes with <font> tags.
        // When React tries to remove the original text node (which is no longer there)
        // during a re-render or navigation, it throws: "Failed to execute 'removeChild' on 'Node'".

        // The most robust way to fix this in React without ejecting Next.js or wrapping 
        // every single text node in a <span> is to patch the native removeChild API 
        // to silently ignore this specific DOM manipulation error.

        if (typeof Node === 'function' && Node.prototype) {
            const originalRemoveChild = Node.prototype.removeChild;

            Node.prototype.removeChild = function <T extends Node>(child: T): T {
                if (child.parentNode !== this) {
                    // If the child is no longer attached to this parent (because Google Translate
                    // moved or replaced it), we just return the child and pretend we removed it
                    // to satisfy React's virtual DOM reconciliation.
                    if (console) {
                        console.debug('Google Translate React Fix: Caught removeChild error on detached node.', child);
                    }
                    return child;
                }

                // Otherwise, proceed with the normal DOM removal
                return originalRemoveChild.apply(this, [child]) as T;
            };

            const originalInsertBefore = Node.prototype.insertBefore;
            Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
                if (referenceNode && referenceNode.parentNode !== this) {
                    if (console) {
                        console.debug('Google Translate React Fix: Caught insertBefore error on detached reference node.', referenceNode);
                    }
                    return newNode;
                }
                return originalInsertBefore.apply(this, [newNode, referenceNode]) as T;
            };
        }

        return () => {
            // We don't restore the original prototypes here because we want this 
            // protection to persist across the entire session once loaded.
        }
    }, [pathname, searchParams])

    return null
}

export default function TranslationFixer() {
    return (
        <Suspense fallback={null}>
            <TranslationFixerContent />
        </Suspense>
    )
}
