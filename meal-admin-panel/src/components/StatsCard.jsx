const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType, 
  color, 
  progress, 
  pending,
  breakdown 
}) => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  }

  const changeColorMap = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-sm mt-1 ${changeColorMap[changeType]}`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Progress Bar */}
      {progress && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress.label}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${colorMap[color].split(' ')[1]}`}
              style={{ width: `${(progress.value / progress.max) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Pending Count */}
      {pending !== undefined && (
        <div className="mt-3">
          <span className="text-xs font-medium text-gray-500">
            Pending approvals: <span className="text-red-600">{pending}</span>
          </span>
        </div>
      )}

      {/* Breakdown for multiple items */}
      {breakdown && (
        <div className="mt-4 space-y-2">
          {breakdown.map((item, index) => (
            <div key={index} className="flex justify-between text-xs">
              <span className="text-gray-500">{item.type}:</span>
              <span className={`font-medium text-${item.color}-600`}>
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StatsCard