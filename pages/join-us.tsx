import { useState } from 'react'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'

export default function JoinUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    membershipType: 'core',
    message: ''
  })

  const applicationSteps = [
    {
      step: 1,
      title: 'Submit Documents',
      description: 'Complete your application with required documents',
      items: [
        'Application Form (Download Template)',
        'Institutional PPT (core technologies/roadmaps)',
        'Sealed Membership Cooperation Agreement'
      ]
    },
    {
      step: 2,
      title: 'Three-Tier Review',
      description: 'Your application goes through our comprehensive review process',
      items: [
        'Secretariat初审 (Initial Review)',
        'Secretary-General/Core Members复评 (Secondary Review)',
        'Decision-making Board终审 (Final Review)'
      ]
    },
    {
      step: 3,
      title: 'Fee Payment',
      description: 'Pay your annual membership fee',
      items: [
        'Annual fee via bank transfer',
        'Cryptocurrency payment accepted',
        'Secure payment processing'
      ]
    },
    {
      step: 4,
      title: 'Certification',
      description: 'Receive your membership certification',
      items: [
        'E-certificate issued within 5 business days',
        'Full member access activation',
        'Welcome package and resources'
      ]
    }
  ]

  const membershipTypes = [
    {
      type: 'core',
      title: 'Core Members',
      description: 'Lead international standard development',
      features: [
        'Lead international standard development',
        'Gain DITC Certified mark for product credibility',
        'Voting rights in decision-making processes',
        'Priority access to new standards',
        'Logo placement on website'
      ],
      highlight: false
    },
    {
      type: 'sme',
      title: 'SMEs & Startups',
      description: 'Low-cost access to cutting-edge standards',
      features: [
        'Low-cost access to cutting-edge standards (Associate tier)',
        'Learn best practices via TC observer programs',
        'Networking opportunities with industry leaders',
        'Access to technical documentation',
        'Professional development resources'
      ],
      highlight: false
    },
    {
      type: 'government',
      title: 'Governments',
      description: 'Shape national digital infrastructure policies',
      features: [
        'Shape national digital infrastructure policies',
        'Influence international standards development',
        'Access to policy frameworks and guidelines',
        'Collaboration with global regulatory bodies',
        'Strategic advisory services'
      ],
      highlight: false
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  return (
    <>
      <SEOHead
        title="Join DITC | Digital Infrastructure Technical Council"
        description="Join DITC and contribute to digital infrastructure standards. Choose from Core Members, SMEs & Startups, or Government membership."
      />
      <Layout>
        {/* Banner */}
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                How to Join DITC
              </h1>
              <p className="mb-8 text-lg text-body-color dark:text-dark-6 max-w-3xl mx-auto">
                Become part of the global community shaping the future of digital infrastructure standards
              </p>
              <ul className="flex items-center justify-center gap-[10px]">
                <li><a href="/" className="text-base font-medium text-dark dark:text-white">Home</a></li>
                <li><span className="text-body-color dark:text-dark-6"> / </span></li>
                <li><span className="text-base font-medium text-body-color">Join Us</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4-Step Process */}
        <section className="py-20 lg:py-[120px] bg-gray-1 dark:bg-dark-2">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2]">
                4-Step Application Process
              </h2>
              <p className="text-lg text-body-color dark:text-dark-6 max-w-3xl mx-auto">
                Our streamlined membership application process ensures quality and efficiency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {applicationSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  {/* Step Number */}
                  <div className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full text-2xl font-bold mb-6 mx-auto">
                    {step.step}
                  </div>
                  
                  {/* Connector Line */}
                  {index < applicationSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-300 dark:bg-dark-3 transform translate-x-8"></div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-body-color dark:text-dark-6 mb-4">
                      {step.description}
                    </p>
                    <ul className="text-sm text-body-color dark:text-dark-6 space-y-2">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start justify-start">
                          <svg className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-left">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <button className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Begin Application
              </button>
            </div>
          </div>
        </section>

        {/* Why Join DITC */}
        <section className="py-20 lg:py-[120px]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2]">
                Why Join DITC?
              </h2>
              {/* <p className="text-lg text-body-color dark:text-dark-6 max-w-3xl mx-auto">
                Different membership types designed for different needs and goals
              </p> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {membershipTypes.map((membership, index) => (
                <div key={membership.type} className={`bg-white dark:bg-dark rounded-lg shadow-lg border-2 p-8 ${
                  membership.highlight ? 'border-primary ring-4 ring-primary/20' : 'border-gray-200 dark:border-dark-3'
                }`}>
                  {/* {membership.highlight && (
                    <div className="bg-primary text-white text-center py-2 px-4 rounded-lg text-sm font-medium mb-6">
                      Recommended
                    </div>
                  )} */}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
                      {membership.title}
                    </h3>
                    <p className="text-body-color dark:text-dark-6 mb-4">
                      {membership.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {membership.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-body-color dark:text-dark-6">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    membership.highlight
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-gray-100 dark:bg-dark-2 text-dark dark:text-white hover:bg-primary hover:text-white'
                  }`}>
                    Apply for {membership.title}
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        {/* <section className="bg-gray-1 pb-8 pt-20 dark:bg-dark-2 lg:pb-[70px] lg:pt-[120px]">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4 lg:w-1/2">
                <div className="mb-12 max-w-[540px] lg:mb-0">
                  <h2 className="mb-5 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2]">
                    Start Your Application
                  </h2>
                  <p className="mb-10 text-base leading-relaxed text-body-color dark:text-dark-6">
                    Ready to join DITC? Fill out our application form and one of our team members will contact you within 24 hours to guide you through the next steps.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-dark dark:text-white mb-2">Quick Response</h4>
                        <p className="text-body-color dark:text-dark-6">We respond to all applications within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-dark dark:text-white mb-2">Professional Review</h4>
                        <p className="text-body-color dark:text-dark-6">Three-tier review process ensures quality membership</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-dark dark:text-white mb-2">Secure Process</h4>
                        <p className="text-body-color dark:text-dark-6">Your information is protected throughout the process</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full px-4 lg:w-1/2">
                <div className="bg-white dark:bg-dark rounded-lg shadow-lg p-8 border border-gray-200 dark:border-dark-3">
                  <h3 className="text-2xl font-bold text-dark dark:text-white mb-6 text-center">Membership Application</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                        Full Name / Organization Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your full name or organization name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your contact email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                        Organization / Institution
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your organization or institution name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                        Membership Type *
                      </label>
                      <select
                        required
                        value={formData.membershipType}
                        onChange={(e) => setFormData({...formData, membershipType: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="core">Core Members</option>
                        <option value="sme">SMEs & Startups</option>
                        <option value="government">Government</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                        Tell us about your interest in DITC
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Describe your core technologies, roadmaps, or how you plan to contribute to DITC..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Application
                    </button>
                  </form>

                  <p className="text-xs text-body-color dark:text-dark-6 text-center mt-4">
                    By submitting this form, you agree to our terms and conditions and privacy policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </Layout>
    </>
  )
} 