import React, { Component } from 'react'
import '../styles/Openweather.css'

type OpenweatherState = {
  lat: number
  lon: number
  temp: number
  conditions: string
  feelsLike: number
  isLoading: boolean
  tomorrowHigh: number
  tomorrowLow: number
  tomorrowConditions: string
}

class Openweather extends Component<{}, OpenweatherState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      lat: 0,
      lon: 0,
      temp: 0,
      conditions: '',
      feelsLike: 0,
      isLoading: false,
      tomorrowHigh: 0,
      tomorrowLow: 0,
      tomorrowConditions: '',
    }
    this.isLoading = this.isLoading.bind(this)
    this.displayWeather = this.displayWeather.bind(this)
  }

  componentDidMount() {
    this.location()
  }

  //   componentDidUpdate(prevState: any) {
  //     if (!prevState.isLoading !== false) {
  //       this.setState({ isLoading: false })
  //     }
  //     console.log('updating')
  //   }

  componentWillUnmount() {
    // resetting state
    this.setState({
      lat: 0,
      lon: 0,
      temp: 0,
      conditions: '',
      feelsLike: 0,
      tomorrowHigh: 0,
      tomorrowLow: 0,
      tomorrowConditions: '',
      isLoading: false,
    })
  }

  location = (): void => {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      })
    })
  }

  fetchWeather = async (): Promise<void> => {
    this.setState({ isLoading: true })

    const { lat, lon } = this.state
    const baseUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=792aea5e57486b3bf6f55ade249fb41e`

    let res = await fetch(baseUrl)
    let data = await res.json()
    this.setState({
      temp: Math.round(data.current.temp),
      conditions: data.current.weather[0].description,
      feelsLike: Math.round(data.current.feels_like),
      tomorrowHigh: Math.round(data.daily[1].temp.day),
      tomorrowLow: Math.round(data.daily[1].temp.eve),
      tomorrowConditions: data.daily[1].weather[0].main,
      isLoading: false,
    })
    // console.log(data)
  }

  isLoading(): JSX.Element {
    return <p>Loading...</p>
  }

  displayWeather(): JSX.Element {
    const {
      temp,
      feelsLike,
      conditions,
      tomorrowHigh,
      tomorrowLow,
      tomorrowConditions,
    } = this.state
    return temp > 0 ? (
      <>
        <h3>{`Currently: ${temp}\u00B0F`}</h3>
        <p className='today'>
          {`Feels like ${feelsLike}\u00B0F. ${conditions}.`}
        </p>
        <p>{`Tomorrow's high will be ${tomorrowHigh}\u00B0F and the low will be ${tomorrowLow}\u00B0F. You can expect conditions to be ${tomorrowConditions}.`}</p>
      </>
    ) : (
      <></>
    )
  }

  render() {
    const { isLoading } = this.state
    return (
      <div className='background'>
        <div className='temperature'>
          <h1>What's Your Weather?</h1>
          <button className='btn' onClick={this.fetchWeather}>
            Fetch Your Weather
          </button>
          {!isLoading === false ? this.isLoading() : this.displayWeather()}
        </div>
      </div>
    )
  }
}

export default Openweather
