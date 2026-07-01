/** Shape of every entry in src/data/problems_advanced.json */
export interface Problem {
  id: number
  title: string
  question: string
  technique: string
  code: string
  stdin: string
  expected_output: string
  note?: string
}
