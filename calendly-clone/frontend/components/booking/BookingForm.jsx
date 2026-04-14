export default function BookingForm({ formData, setFormData, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
        <input
          required
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-calendly focus:ring-1 focus:ring-calendly"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
        <input
          required
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-calendly focus:ring-1 focus:ring-calendly"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Please share anything that will help prepare for our meeting.</label>
        <textarea
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-calendly focus:ring-1 focus:ring-calendly"
          value={formData.notes}
          onChange={e => setFormData({...formData, notes: e.target.value})}
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-calendly text-white rounded-full font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Scheduling..." : "Schedule Event"}
      </button>
    </form>
  );
}
