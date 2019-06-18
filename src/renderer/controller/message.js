import {E} from '@/main'

export const success = (text) => {
  E.$message({
    dangerouslyUseHTMLString: false,
    message: text,
    type: 'success',
    customClass: 'headline',
    duration: 1000
  })
}
export const error = (text) => {
  E.$message({
    dangerouslyUseHTMLString: false,
    message: text,
    type: 'error',
    customClass: 'headline',
    duration: 1000
  })
}
export const info = (text) => {
  E.$message({
    dangerouslyUseHTMLString: false,
    message: text,
    type: 'info',
    customClass: 'headline',
    duration: 1000
  })
}
