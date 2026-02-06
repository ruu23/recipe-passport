import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Benefits from '@/components/recipe/Benefits'
import History from '@/components/recipe/History'
import Ingredients from '@/components/recipe/Ingredients'
import InstructionsPage from '@/components/recipe/Instructions'

function index() {
  return (
    <div>
      <Header />
      <main>
        <History />
        <Ingredients />
        <InstructionsPage />
        <Benefits />
      </main>
      <Footer />
    </div>
  )
}

export default index
