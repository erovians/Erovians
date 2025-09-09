import React, { useRef, useState, useEffect } from "react";

const Sidebar = () => {
  const advertiseRef = useRef(null);
  const recommendationRef = useRef(null);
  const priceRef = useRef(null);
  const qualityRef = useRef(null);
  const dispatchRef = useRef(null);

  const [active, setActive] = useState("advertise");

  const sections = [
    { id: "advertise", label: "Advertise Your Products", ref: advertiseRef },
    { id: "recommendation", label: "Product Recommendation", ref: recommendationRef },
    { id: "price", label: "Price Recommendation", ref: priceRef },
    { id: "quality", label: "Quality Dashboard", ref: qualityRef },
    { id: "dispatch", label: "Next Day Dispatch Program", ref: dispatchRef },
  ];

  const scrollToSection = (ref, id) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  // Highlight active section on scroll
  useEffect(() => {
    const observers = sections.map((section) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(section.id);
          }
        },
        { threshold: 0.4 }
      );
      if (section.ref.current) observer.observe(section.ref.current);
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 sticky top-0 h-screen bg-white border-r p-6 space-y-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.ref, section.id)}
            className={`block w-full text-left px-3 py-2 rounded-lg font-medium ${
              active === section.id
                ? "bg-pink-100 text-pink-600 border-l-4 border-pink-500"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-10 space-y-20">
        <section ref={advertiseRef} className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Advertise Your Products</h2>
          <p>Promote your products and catalogs... Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati eum, rem nihil suscipit at nobis molestiae neque eaque. Dolore minima repellat accusamus, voluptates earum magnam tenetur recusandae, odit nemo dolor, quos ab repellendus voluptatibus ipsa quod facere modi? Ducimus perferendis neque, itaque recusandae id accusamus sint? Molestias, magni minima, laboriosam, rem illum harum voluptates libero similique rerum dolores perferendis veritatis. Asperiores magni in totam. Voluptatum ullam labore atque laudantium pariatur et earum possimus perspiciatis exercitationem minus recusandae distinctio obcaecati assumenda, deserunt, suscipit ea quo vel. Totam fugiat aliquam libero consectetur accusamus nihil inventore aspernatur quae nesciunt perspiciatis doloremque vero, commodi eligendi sequi ducimus eos repudiandae accusantium labore omnis. Dicta impedit enim, sunt sed ducimus ipsa corporis eligendi magnam? Blanditiis laudantium totam aperiam odio asperiores fugit accusamus ipsam tenetur deserunt perspiciatis nesciunt odit, magnam ad? Enim temporibus amet quas a, quos vero ex earum esse, ducimus consequuntur architecto corrupti, consequatur dolorum accusantium molestias mollitia totam odit cum obcaecati nostrum quod laborum quam voluptatibus. Quibusdam sed quo quos laudantium neque, dolorem aliquid architecto maxime rem molestiae eum rerum ipsum nemo, labore nesciunt aut officia. Aspernatur laborum, nobis beatae accusantium provident id delectus rem voluptate magnam culpa earum nam. Earum at fugiat nihil?</p>
        </section>

        <section ref={recommendationRef} className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Product Recommendation</h2>
          <p>Recommendations and ways to increase sales... Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates fugiat eum esse sequi odit. Placeat nihil fugiat dolor qui nam quam! Magnam, possimus labore. Maxime perferendis delectus ut itaque id! Fugiat tempore obcaecati non modi corrupti hic ullam eius culpa velit voluptates, laudantium nobis aspernatur quo rerum qui illo mollitia ratione blanditiis dignissimos atque magni ea deserunt. Nesciunt vero fuga similique saepe necessitatibus rem beatae, cum quaerat! Sint quam eligendi blanditiis sed doloribus ex dolorem repellendus quod adipisci culpa, deleniti excepturi asperiores accusamus. Saepe voluptatum aspernatur minima illum laboriosam eveniet vitae, veniam impedit dolorem, aperiam reprehenderit nulla sapiente facilis voluptate fuga nostrum neque corrupti dolores veritatis temporibus voluptatem exercitationem consectetur. Minima explicabo fugiat ad officia corporis nobis rem fugit ipsa facilis. Cupiditate quam quisquam laudantium architecto, minus itaque porro? Enim excepturi incidunt odit alias corrupti nam iure suscipit libero, minus perspiciatis inventore quod ducimus reprehenderit voluptas voluptates? Quo placeat similique reprehenderit molestiae distinctio recusandae soluta, tempora nobis nesciunt illum. Minus distinctio qui excepturi numquam quas error ullam. Tempore maiores eveniet, sint illo incidunt nisi iure quasi voluptatibus voluptates quaerat libero inventore, facere maxime ad eum alias autem quidem consequuntur dolores necessitatibus blanditiis? Sunt minima non, numquam doloremque ratione quae assumenda!</p>
        </section>

        <section ref={priceRef} className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Price Recommendation</h2>
          <p>Here you will get price suggestions...Recommendations and ways to increase sales... Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates fugiat eum esse sequi odit. Placeat nihil fugiat dolor qui nam quam! Magnam, possimus labore. Maxime perferendis delectus ut itaque id! Fugiat tempore obcaecati non modi corrupti hic ullam eius culpa velit voluptates, laudantium nobis aspernatur quo rerum qui illo mollitia ratione blanditiis dignissimos atque magni ea deserunt. Nesciunt vero fuga similique saepe necessitatibus rem beatae, cum quaerat! Sint quam eligendi blanditiis sed doloribus ex dolorem repellendus quod adipisci culpa, deleniti excepturi asperiores accusamus. Saepe voluptatum aspernatur minima illum laboriosam eveniet vitae, veniam impedit dolorem, aperiam reprehenderit nulla sapiente facilis voluptate fuga nostrum neque corrupti dolores veritatis temporibus voluptatem exercitationem consectetur. Minima explicabo fugiat ad officia corporis nobis rem fugit ipsa facilis. Cupiditate quam quisquam laudantium architecto, minus itaque porro? Enim excepturi incidunt odit alias corrupti nam iure suscipit libero, minus perspiciatis inventore quod ducimus reprehenderit voluptas voluptates? Quo placeat similique reprehenderit molestiae distinctio recusandae soluta, tempora nobis nesciunt illum. Minus distinctio qui excepturi numquam quas error ullam. Tempore maiores eveniet, sint illo incidunt nisi iure quasi voluptatibus voluptates quaerat libero inventore, facere maxime ad eum alias autem quidem consequuntur dolores necessitatibus blanditiis? Sunt minima non, numquam doloremque ratione quae assumenda!</p>
        </section>

        <section ref={qualityRef} className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Quality Dashboard</h2>
          <p>Track your product quality score...Recommendations and ways to increase sales... Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates fugiat eum esse sequi odit. Placeat nihil fugiat dolor qui nam quam! Magnam, possimus labore. Maxime perferendis delectus ut itaque id! Fugiat tempore obcaecati non modi corrupti hic ullam eius culpa velit voluptates, laudantium nobis aspernatur quo rerum qui illo mollitia ratione blanditiis dignissimos atque magni ea deserunt. Nesciunt vero fuga similique saepe necessitatibus rem beatae, cum quaerat! Sint quam eligendi blanditiis sed doloribus ex dolorem repellendus quod adipisci culpa, deleniti excepturi asperiores accusamus. Saepe voluptatum aspernatur minima illum laboriosam eveniet vitae, veniam impedit dolorem, aperiam reprehenderit nulla sapiente facilis voluptate fuga nostrum neque corrupti dolores veritatis temporibus voluptatem exercitationem consectetur. Minima explicabo fugiat ad officia corporis nobis rem fugit ipsa facilis. Cupiditate quam quisquam laudantium architecto, minus itaque porro? Enim excepturi incidunt odit alias corrupti nam iure suscipit libero, minus perspiciatis inventore quod ducimus reprehenderit voluptas voluptates? Quo placeat similique reprehenderit molestiae distinctio recusandae soluta, tempora nobis nesciunt illum. Minus distinctio qui excepturi numquam quas error ullam. Tempore maiores eveniet, sint illo incidunt nisi iure quasi voluptatibus voluptates quaerat libero inventore, facere maxime ad eum alias autem quidem consequuntur dolores necessitatibus blanditiis? Sunt minima non, numquam doloremque ratione quae assumenda!</p>
        </section>

        <section ref={dispatchRef} className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Next Day Dispatch Program</h2>
          <p>Benefits of registering and steps to register...Recommendations and ways to increase sales... Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates fugiat eum esse sequi odit. Placeat nihil fugiat dolor qui nam quam! Magnam, possimus labore. Maxime perferendis delectus ut itaque id! Fugiat tempore obcaecati non modi corrupti hic ullam eius culpa velit voluptates, laudantium nobis aspernatur quo rerum qui illo mollitia ratione blanditiis dignissimos atque magni ea deserunt. Nesciunt vero fuga similique saepe necessitatibus rem beatae, cum quaerat! Sint quam eligendi blanditiis sed doloribus ex dolorem repellendus quod adipisci culpa, deleniti excepturi asperiores accusamus. Saepe voluptatum aspernatur minima illum laboriosam eveniet vitae, veniam impedit dolorem, aperiam reprehenderit nulla sapiente facilis voluptate fuga nostrum neque corrupti dolores veritatis temporibus voluptatem exercitationem consectetur. Minima explicabo fugiat ad officia corporis nobis rem fugit ipsa facilis. Cupiditate quam quisquam laudantium architecto, minus itaque porro? Enim excepturi incidunt odit alias corrupti nam iure suscipit libero, minus perspiciatis inventore quod ducimus reprehenderit voluptas voluptates? Quo placeat similique reprehenderit molestiae distinctio recusandae soluta, tempora nobis nesciunt illum. Minus distinctio qui excepturi numquam quas error ullam. Tempore maiores eveniet, sint illo incidunt nisi iure quasi voluptatibus voluptates quaerat libero inventore, facere maxime ad eum alias autem quidem consequuntur dolores necessitatibus blanditiis? Sunt minima non, numquam doloremque ratione quae assumenda!</p>
        </section>
      </div>
    </div>
  );
};

export default Sidebar;
