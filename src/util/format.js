import moment from 'moment'

export function getProjectDateText (project) {
  const startDate = moment(project.start_date)
  const endDate = moment(project.end_date)
  let dateText = null
  if (startDate.isValid() && endDate.isValid()) {
    const equalYears = startDate.format('YYYY') === endDate.format('YYYY')
    const startDateText = equalYears ? startDate.format('MMMM Do') : startDate.format('MMMM Do, YYYY')
    const endDateText = endDate.format('MMMM Do, YYYY')
    dateText = `${startDateText} – ${endDateText}`
  }
  else if (startDate.isValid()) {
    dateText = startDate.format('MMMM Do, YYYY')
  }

  return dateText
}
