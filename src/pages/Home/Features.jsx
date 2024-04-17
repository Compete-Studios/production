import IconBarChart from "../../components/Icon/IconBarChart"
import IconChartSquare from "../../components/Icon/IconChartSquare"
import IconCloudDownload from "../../components/Icon/IconCloudDownload"
import IconUsers from "../../components/Icon/IconUsers"
import IconMenuUsers from "../../components/Icon/Menu/IconMenuUsers"

const features = [
  {
    name: 'An unfair advantage',
    description:
      'Give your studio the edge over the competition. You’ve already done the hard part; you’ve built out your location, you have a great team of teachers, and your program is awesome…but if your growth has plateaued, you need to supercharge your enrollment process to take it all to the next level. An online enrollment system just won’t cut it.',
    icon: IconBarChart,
  },
  {
    name: 'The “Go-To” Studio',
    description:
      'Become the first choice for students and families when it comes to choosing a studio. There are more studios today than there were ten years ago. Standing out is even harder in an over saturated market. It’s becoming even more important to get your information in front of the right people and to keep it there.',
    icon: IconChartSquare,
  },
  {
    name: 'High-Value Students',
    description:
      'It’s about more than just “getting your info out there.” It’s about starting conversations with the students that are most likely to thrive in your program. The Compete Studio system attracts high-value, committed students willing to pay higher tuition rates and stay enrolled for longer. Once a student who is looking for their studio home has made a memorable connect with you and your program, you become the obvious choice when it’s time to enroll.',
    icon: IconUsers,
  },
  {
    name: 'Staffing Systems',
    description:
      'With clear procedures for your staff to follow, the work of managing prospects, scheduling intro classes, collecting payments, and enrolling new students gets done efficiently and consistently. Your staff logs into the software each shift, sees an easy to follow checklist of work to be done, logs out, and does it again the next day. As the studio owner, you can even see the work being done remotely, giving you confidence that your operations are running smoothly.',
    icon: IconMenuUsers,
  },
]

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Work Smarter Not Harder</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to run your studio
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            The Compete Studio system is a comprehensive software solution that helps you manage your studio from anywhere.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
