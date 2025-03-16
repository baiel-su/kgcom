import CateringApplicationForm from "@/components/forms/catering/applicationForm";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Food Catering Application</h1>
      <p className="text-muted-foreground mb-8">Fill out the form below to apply as a food vendor on our platform.</p>
      <CateringApplicationForm />
    </main>
  )
}

