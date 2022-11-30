/*
export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/classic?lat=58.589126&lon=16.187097')
    const posts = await res.json()
  
    // Get the paths we want to pre-render based on posts
    const paths = posts.map((post) => ({
      params: { id: post.id },
    }))
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }
  
  const req = async () => {

    const latitude = 58.5892;
    const longitude = 16.1871;

    //Get JSON
    // https://open-meteo.com/en/docs
    const link = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m,weathercode&current_weather=true'
    const response = await axios.get(link)
    console.log('Temperature: '
    + response.data.current_weather.temperature
    + ' Weather Code: '
    + response.data.current_weather.weathercode)

  }
  req() 
*/