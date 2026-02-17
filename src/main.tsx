import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Aggressive service worker cleanup - must run BEFORE app render
if ('serviceWorker' in navigator) {
	// Unregister all existing service workers
	navigator.serviceWorker.getRegistrations().then((registrations) => {
		console.log(`[SW Cleanup] Found ${registrations.length} service worker(s), unregistering all...`);
		registrations.forEach((registration) => {
			registration.unregister().then(() => {
				console.log('[SW Cleanup] Service worker unregistered:', registration.scope);
			});
		});
	});

	// Clear all caches
	if ('caches' in window) {
		caches.keys().then((names) => {
			console.log(`[Cache Cleanup] Clearing ${names.length} cache(s)...`);
			Promise.all(names.map((name) => caches.delete(name))).then(() => {
				console.log('[Cache Cleanup] All caches cleared');
			});
		});
	}

	// Prevent any new service worker registration
	navigator.serviceWorker.oncontrollerchange = () => {
		console.log('[SW Cleanup] Controller changed, unregistering...');
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			registrations.forEach((r) => r.unregister());
		});
	};
}

createRoot(document.getElementById("root")!).render(<App />);

