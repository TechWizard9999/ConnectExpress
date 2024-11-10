import React from 'react'
import { FaTrain, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa'

const InfoSection = () => {
  const features = [
    {
      icon: <FaTrain size={40} className="text-blue-600" />,
      title: 'Direct & Connecting Trains',
      description: 'Find and book direct or connecting trains seamlessly.',
    },
    {
      icon: <FaExchangeAlt size={40} className="text-blue-600" />,
      title: 'Flexible Routes',
      description: 'Choose from multiple route options with detailed transfer information.',
    },
    {
      icon: <FaShieldAlt size={40} className="text-blue-600" />,
      title: 'Risk Assessment',
      description: 'Evaluate risk factors based on train delays and connection times.',
    },
  ]

  return (
    <section id="features" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Why Choose Us?</h2>
        <div className="flex flex-wrap justify-center space-x-0 space-y-6 md:space-y-0 md:space-x-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-sm">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InfoSection
