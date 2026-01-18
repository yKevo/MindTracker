export default function LegalModal({ onAccept }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-2">Terms & Privacy</h2>

        <p className="text-sm mb-3">
          MindTracker is a self-help and journaling tool. It is not a medical
          service and does not replace professional care.
        </p>

        <h3 className="font-semibold mt-4">Privacy</h3>
        <p className="text-sm mb-3">
          Your journal entries are stored securely. We do not sell personal
          data. Community posts are anonymous.
        </p>

        <h3 className="font-semibold mt-4">Payments</h3>
        <p className="text-sm mb-3">
          Payments are processed securely by Stripe. We do not store card data.
        </p>

        <h3 className="font-semibold mt-4">Emergency</h3>
        <p className="text-sm mb-4">
          If you are in crisis, contact 988 or local emergency services.
        </p>

        <button
          onClick={onAccept}
          className="w-full bg-purple-600 text-white py-3 rounded-xl"
        >
          I Agree
        </button>
      </div>
    </div>
  );
}
