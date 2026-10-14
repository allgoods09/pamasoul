import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { Toaster } from "react-hot-toast";
import MotionProvider from "./Components/Motion/MotionProvider";
import FlashMessages from "./Components/FlashMessages";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "PamaSoul";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <MotionProvider>
                <App {...props}>
                    {({ Component, props, key }) => (
                        <>
                            <FlashMessages />
                            <Component key={key} {...props} />
                        </>
                    )}
                </App>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4500,
                        style: {
                            borderRadius: "14px",
                            border: "1px solid #E1D1FF",
                            color: "#41295f",
                        },
                    }}
                />
            </MotionProvider>,
        );
    },
    progress: {
        color: "#B49AFF",
    },
});
