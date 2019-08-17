const config = require('config')
const http = require('http')


export function request (url: string) {
  return new Promise((resolve) => {
    const home = config.get('httpAddress')
    console.log('home', home)
    http.get({ path: `${config.get('httpAddress')}${url}` }, (response: any) => {
      console.log('response', response)
      let data = ''
      response.on('data', (_data: string) => (data += _data))
      response.on('end', () => resolve(data))
    })
  })
}
