import { Plus, BarChart3, MessageSquare, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const QuickActions = () => {
  const actions = [
    {
      title: 'Add New Meal',
      description: 'Create a new meal item',
      icon: Plus,
      href: '/meals',
      color: 'bg-blue-500'
    },
    {
      title: 'View Analytics',
      description: 'See detailed reports and insights',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-green-500'
    },
    {
      title: 'Check Feedback',
      description: 'Review student feedback',
      icon: MessageSquare,
      href: '/feedback',
      color: 'bg-purple-500'
    },
    {
      title: 'Manage Students',
      description: 'View and manage student accounts',
      icon: Users,
      href: '/students',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.href}
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className={`flex-shrink-0 h-10 w-10 ${action.color} rounded-lg flex items-center justify-center`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{action.title}</p>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default QuickActions