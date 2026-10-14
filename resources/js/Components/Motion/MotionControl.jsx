import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { SparklesIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useMotion } from "./MotionProvider";
const modes = [
    ["calm", "Calm", "Simple transitions"],
    ["flow", "Flow", "Smooth reveals & gentle tracking"],
    ["bold", "Bold", "Parallax, floating layers & tilt"],
];
export default function MotionControl() {
    const { mode, reduced, setMode } = useMotion();
    return (
        <Menu as="div" className="relative">
            <MenuButton
                className="motion-control"
                aria-label="Choose animation intensity"
            >
                <SparklesIcon className="w-4 h-4" />
                <span className="hidden sm:inline">
                    {reduced ? "Calm" : modes.find((m) => m[0] === mode)[1]}
                </span>
            </MenuButton>
            <MenuItems
                transition
                className="absolute right-0 top-full mt-2 w-72 bg-white border border-pamasoul-100 rounded-2xl shadow-xl p-2 z-50 origin-top-right transition duration-200 data-[closed]:opacity-0 data-[closed]:scale-95"
            >
                <p className="px-3 pt-2 pb-3 text-xs font-semibold text-gray-500">
                    MAKE YOURSELF COMFORTABLE
                </p>
                {modes.map(([key, label, description]) => (
                    <MenuItem key={key}>
                        <button
                            onClick={() => setMode(key)}
                            disabled={reduced && key !== "calm"}
                            aria-pressed={
                                mode === key || (reduced && key === "calm")
                            }
                            className="w-full flex items-center justify-between text-left px-3 py-3 rounded-xl data-[focus]:bg-pamasoul-50 disabled:opacity-40"
                        >
                            <span>
                                <span className="block text-sm font-semibold text-pamasoul-900">
                                    {label}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {description}
                                </span>
                            </span>
                            {(reduced ? key === "calm" : mode === key) && (
                                <CheckIcon className="w-4 h-4 text-pamasoul-600" />
                            )}
                        </button>
                    </MenuItem>
                ))}
                {reduced && (
                    <p className="px-3 py-2 text-xs text-gray-500">
                        Your device’s reduced-motion setting is active.
                    </p>
                )}
            </MenuItems>
        </Menu>
    );
}
