import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// LOGGING CONFIG
// Submissions are sent to the Vercel proxy which writes to Airtable.
// ─────────────────────────────────────────────────────────────────────────────
const LOGGER_URL = "https://writing-app-logger.vercel.app/api/log";

// Logging function with visible error reporting for debugging.
// Remove the setLogError calls once logging is confirmed working.
let _setLogError = null;
function logToAirtable({ firstName, surname, teacher, textTitle, attemptNumber, submission, totalScore, sessionBest, scores }) {
  setTimeout(async () => {
    try {
      const payload = {
        "Student Name":    `${firstName} ${surname}`.trim(),
        "Teacher":         teacher || "",
        "Timestamp":       new Date().toISOString(),
        "App":             "main-idea",
        "Text Title":      String(textTitle     || ""),
        "Attempt Number":  Number(attemptNumber || 1),
        "Submission":      String(submission    || "").slice(0, 500),
        "Total Score":     Number(totalScore    || 0),
        "Max Score":       5,
        "Session Best":    Number(sessionBest   || 0),
        "Score Breakdown": JSON.stringify(scores || {})
      };
      const res = await fetch(LOGGER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        if (_setLogError) _setLogError(`Log error ${res.status}: ${text.slice(0, 200)} | Payload: ${JSON.stringify(payload).slice(0, 200)}`);
      } else {
        if (_setLogError) _setLogError("Log OK: row was sent to Airtable.");
      }
    } catch (e) {
      if (_setLogError) _setLogError(`Log network error: ${e.message}`);
    }
  }, 0);
}

const TEXTS = [
  {
    id: "adhd",
    title: "A Better Name for ADHD: VAST",
    body: `ADHD is more than just a disorder. It comes with both challenges and strengths. A new term, "Variable Attention Stimulus Trait" (VAST), better describes the unique qualities of an ADHD brain. This name focuses less on the medical aspect and more on the positive traits, such as creativity and determination. It also recognizes emotional experiences like rejection sensitive dysphoria, which causes intense feelings of rejection, and its opposite, recognition responsive euphoria, where encouragement inspires great motivation.

People with VAST often experience extremes. They may struggle to focus at times but can hyperfocus when something interests them. They may feel easily distracted but are also highly curious. Negative feedback can trigger strong emotions, making them feel rejected or defeated. However, positive recognition has the opposite effect. It can energize and inspire them, helping them achieve their goals. Praise and encouragement are key to unlocking their potential.

To support people with VAST, it's important to focus on their efforts and progress, not just perfection. Positive feedback builds their confidence and motivation. By surrounding themselves with supportive people and managing challenges, individuals with VAST can turn their traits into strengths and achieve success in both personal and professional life.`
  },
  {
    id: "brown",
    title: "A Common Color That's Far From Ordinary",
    body: `Brown is one of the most common colors we see every day. It is the color of eyes, hair, and skin for many people around the world. It is also the color of much in nature, we see brown in trees, soil, and many animals. A lot of our favorite foods and drinks are brown too, like chocolate, coffee, and bread. Additionally, artists have used brown for a very long time. Two of the oldest brown pigments are umber and ochre. They come from natural clay and have been used in cave paintings that are more than 40,000 years old.

In the past, brown clothes were often worn by poor people. In Europe during the Middle Ages, monks wore brown robes to show they lived simple and humble lives. Brown cloth was cheaper because it was easy to produce from simple plant dyes. In Ancient Rome, poor people and those who were not Roman citizens wore brown. The word pullati, which means "those dressed in brown," was used for the poor in cities. In 1363, English laws even said that workers had to wear brown or gray clothes made from simple wool.

Another important source of brown comes from the sea. It is called sepia and was first made from the ink of a sea animal called a cuttlefish. The word "sepia" comes from the Greek word for this animal. Sepia ink was used for painting and drawing in Roman times and subsequently by artists like Leonardo da Vinci. Later, in the 1800s, people also used sepia to give photos a warm brown tone. Today, we can make this effect with computers and filters.

One of the most surprising sources of brown pigment came from dead bodies. In the 1500s, people made a special brown paint from the ground-up remains of Egyptian mummies, both humans and animals like cats. This paint was called "Mummy Brown." Some famous 19th-century Victorian painters, like Edward Burne-Jones and Dante Gabriel Rossetti, used it. Mummy Brown was good for painting skin and hair because its transparency meant that it was good for shading and coloring natural flesh and hair tones. But later, when artists found out what it was made from, many stopped using it. Burne-Jones even buried his tube of paint in the garden. As demand grew and mummies were in short supply, some people began making the paint from the bodies of criminals or slaves. Today, Mummy Brown is made from less morbid materials like clay and minerals, not real bodies.

After the Renaissance, artists continued to use many shades of brown. It helped them paint deep shadows and create realistic portraits. One popular type of brown paint was called Vandyke Brown, named after the painter Anthony van Dyck. He and other artists, like Rembrandt, used brown for dark backgrounds and to build up the light and shade in their pictures. To this day, many artists paint on brown surfaces instead of white. This helps them contrast light and dark more clearly.

Today, brown has a new meaning. In the past, people saw it as dull or poor. Now, however, brown is often used to show care for the environment. Products like bamboo toothbrushes, recycled paper, and cork use brown to show they are natural and sustainable. Companies now use brown in their designs to connect with people who care about the planet. Brown is no longer a color of "less than", instead, it represents a better and greener future.

So, brown may seem like a simple color, but its story is rich and full of surprises. From ancient paint to modern eco-products, brown has been a color of nature, poverty, art, and now, sustainability. In a modern world full of bright colors, brown still plays an important and powerful role.`
  },
  {
    id: "weightloss",
    title: "A Shot of Hope or a Risky Shortcut?",
    body: `A new type of drug is generating excitement among the rich and the beautiful. Just a shot a week, and you stay thin. Celebrities swear by it, and influencers sing its praises. But the latest weight-loss drugs are not only cosmetic enhancements. Their biggest beneficiaries will be billions of ordinary people around the world, whose weight has made them unhealthy.

In the past, traditional weight-loss methods often did not work well. But these new drugs have shown real results. Clinical trials show that a drug called Wegovy can help people lose around 15% of their body weight. Another version called Ozempic, originally used for diabetes, is also helping people lose weight. Soon, even more powerful versions will be available. Some experts even say these drugs could become as common as medicines for high blood pressure.

These medicines are arriving at a critical moment. In 2020, about 40% of people in the world were overweight or obese. By 2035, that number could grow to over 50%, meaning 4 billion people. Although the populations gaining weight the fastest are not in the rich West but in countries like Egypt, Mexico, and South Africa.

As a result, more people are facing serious health risks. Obesity increases the chance of getting diabetes, heart disease, high blood pressure, and even some cancers. During the COVID-19 pandemic, people with obesity were more likely to die. Children can also suffer because of teasing and bullying related to their weight.

Moreover, obesity is also a big problem for the world's economy. Experts say the annual health cost of obesity could reach $4 trillion by 2035. This includes health care costs and money lost when people cannot work due to sickness or early death.

Although some blame personal choices, scientists say biology plays a major role. Long ago, our bodies needed to store fat to survive in hard times. Today, these same genes make it hard to lose that weight. Also, modern life offers lots of cheap processed foods and encourages sitting rather than moving. Because of this biology, even when people diet, their bodies fight to hold onto the fat.

The discovery of these drugs was an accident. Doctors noticed that patients taking semaglutide for diabetes were also losing weight. The drug copies hormones that make us feel full and less hungry. This helps stop the strong desire to keep eating, which many people struggle with.

Meanwhile, demand for these drugs is growing fast. Investors are excited, and the company that makes semaglutide, Novo Nordisk, has become one of the most valuable drug companies in the world. However, there are two main concerns: safety and cost.

Firstly, safety is very important. Because these drugs are new, we don't yet know their long-term effects. So far, side effects like vomiting or diarrhea have been mild. However, some studies in animals have shown risks like thyroid cancer. Additionally, there are also worries about using the drug during pregnancy. Scientists will need to study these questions carefully over the coming years.

Secondly, cost is a major issue. In the U.S., Wegovy costs about $1,300 per month, and Ozempic is around $900. These prices are too high for many people. If someone needs to take the drug for years, the total cost would be very large. Still, there is hope. In the future, drug companies may work with governments and health systems to lower the price in exchange for selling the drug to more people. Also, other companies are making similar drugs, which may lead to lower prices through competition.

However, these drugs are not a complete solution. Governments should make sure the people who truly need them for health reasons get them. People who want to use them only to look thinner should pay for them privately. Also, other methods like eating healthy food, exercising, and clear food labels are still important to stop obesity before it starts.

In conclusion, these drugs may help the world fight one of its biggest health problems. These new medicines offer real hope for people who struggle with weight. Yet, we must study them more to understand their long-term safety and find ways to make them affordable. Consequently, this new treatment could help many people live longer, healthier lives, and bring us closer to ending the global obesity crisis.`
  },
  {
    id: "lucy",
    title: "A Small Skeleton with a Big Legacy (Lucy the Fossil)",
    body: `The first clue that the fossilized human ancestor known as Lucy would be a global phenomenon came at a Paris airport in December 1974. While passing through customs, paleoanthropologist Donald Johanson introduced the wrapped parcels in his bag as fossils from Ethiopia, and a customs official replied, "You mean Lucy?"

Just a few weeks earlier, Johanson made a major discovery in the Afar region of Ethiopia. While surveying an ancient hillside, he observed a small forearm bone emerging from the ground. This finding led to the recovery of a skeleton that was approximately 40% complete. The remains belonged to an adult female who lived more than three million years ago. The fossil was later given the nickname "Lucy," inspired by the Beatles song Lucy in the Sky with Diamonds, which the research team had been playing at their camp. In scientific circles, she is known as AL 288-1, and in Ethiopia, as Dinkinesh, which means "you are marvelous" in Amharic.

Before Lucy's discovery, early human fossils were usually very fragmentary, often limited to small parts such as a section of a skull or a foot bone. Lucy's skeleton, however, contained significant portions of the skull, spine, pelvis, ribs, arms, and legs. These remains provided clear evidence that she had walked upright on two legs, similar to modern humans, despite having a small brain and a facial structure resembling that of a chimpanzee.

At 3.2 million years old, Lucy was nearly twice the age of any previously discovered human ancestor skeleton. Scientists classified her as a member of a new species, Australopithecus afarensis, meaning "southern ape from Afar." Her bones offered strong support for the idea that upright walking developed before larger brain size in human evolution.

Although earlier discoveries of ancient human relatives had been made, none achieved the level of fame that Lucy did. Her memorable nickname and the completeness of her skeleton allowed people to connect with her story more personally. Another important factor in Lucy's fame was Johanson's ability to communicate scientific ideas to a general audience. He authored the bestselling book Lucy: The Beginnings of Humankind and appeared on popular television programs such as Good Morning America and the science documentary series NOVA. His presentations made the story of Lucy personal and accessible to millions around the world.

Lucy's discovery generated widespread public interest in human evolution. In 1981, Johanson founded the Institute of Human Origins, a non-profit research and education organization. The institute later became part of Arizona State University, where it continues to conduct leading research today. Johanson's strong public presence was not universally welcomed. Some scientists criticized his focus on media attention, while others argued that sharing scientific discoveries with the public was an important responsibility of researchers.

Since 1974, scientists have uncovered even older and more complete fossils, such as "Ardi" and "Little Foot." Nevertheless, Lucy remains the most recognized fossil in the field of paleoanthropology. New discoveries are still often compared to her, with questions such as, "Is it older than Lucy? Is it more complete?" In 2000, another important find was made near Lucy's site. Researchers discovered the fossilized bones of a child from Lucy's species, known as "Selam." Although Selam lived about 200,000 years before Lucy, she is often referred to as "Lucy's Baby" due to her connection to the famous skeleton.

Many scientists today say that Lucy's discovery inspired their careers in paleoanthropology. Chris Campisano, who now leads research at Hadar in Ethiopia, recalls reading Johanson's book as a teenager and choosing to study human origins. The Institute of Human Origins has supported numerous important studies and field projects. The public attention and financial support that followed Lucy's discovery helped make this research possible.

Although Lucy is no longer the oldest or the most complete early human ancestor fossil, she remains the most famous. Her name, the story of her discovery, and the enthusiasm of Donald Johanson have made her a symbol of human evolution. For fifty years, Lucy has helped people around the world understand how humans first walked the Earth, and her legacy continues to inspire new generations of researchers.`
  },
  {
    id: "aggression",
    title: "Are Humans Naturally Aggressive?",
    body: `Some experts think humans are naturally aggressive. Anthropologist Michael Ghiglieri says war is a big part of human evolution, just like sex. He believes that war has shaped how humans behave and survive. Austrian zoologist Konrad Lorenz agreed, saying that aggression developed as a defense mechanism. He claimed it helped humans protect themselves and their families.

In addition, Jane Goodall, a renowned primatologist, observed troops of chimpanzees engaging in warfare with each other. These fights often ended in killings. She suggested humans could inherit this behavior, as chimpanzees are our closest relatives. Another view comes from Barbara Ehrenreich, an American writer. She explained that early humans faced many dangers, like predators, and needed to defend themselves. This survival instinct developed into aggression. These ideas show why many people believe humans are naturally aggressive.

Archaeologists study human history through remains, like bones, tools, and cave paintings. Surprisingly, they found little evidence of organized violence or war before 9,000 BCE. For example, weapons such as spears or arrows used to harm other humans appeared only after 10,000 BCE. Fortified settlements, which show fear of attacks, also became common much later, around 7,000 BCE. Before these times, most human deaths caused by others seem to have come from personal fights or cannibalism, not group violence or war. The remains of bones damaged by other humans from this period are very rare, suggesting that they lived mostly peacefully.

Cave paintings also provide important clues. Paintings made before 10,000 BCE mostly show peaceful activities, like hunting animals. There are practically no drawings of people fighting. Out of thousands of paintings, only a very few, about four, may show people injured by arrows. After 8,000 BCE, this started to change, with more drawings of weapons and battles. Still, even during the Mesolithic period, such scenes were uncommon.

One important exception is the site of Jebel Sahaba in Sudan. Archaeologists discovered 59 skeletons there from 10,000 to 12,000 BCE. Out of these, 24 showed signs of violent deaths, such as injuries from weapons. The site is often considered the earliest evidence of group violence or war. However, some researchers question whether these people were killed in one event or over a longer period. Another interesting case is the walls of Jericho, built between 8,300 and 7,300 BCE. These are some of the earliest examples of fortifications. They suggest that the people of Jericho were afraid of attacks. However, no other settlements from this time had similar defenses, showing that such violence was not common everywhere.

Evidence suggests that warfare began as human societies became more complex. Around 8,000 BCE, people started farming and living in larger, permanent communities. These changes brought new challenges. People needed to defend their land, food, and resources from others. As communities grew, conflicts increased, and some of these became organized into wars. These social and economic changes were key to the start of warfare. Before this time, small groups of hunter-gatherers may not have had much reason to fight over resources. Farming and trade created new opportunities, but also new competition, which led to conflicts.

In conclusion, humans are not naturally warlike. While we can be aggressive, it does not mean we are born to fight wars. The evidence shows that organized violence only began when societies changed and became more complex. This suggests that war is not a part of our biology, but rather something shaped by our social environment. Humans also have the capacity for empathy and cooperation. Just as society created conditions for war, it can also create conditions for peace. This gives hope that by understanding our past, we can work toward a more peaceful future.`
  },
  {
    id: "barbie",
    title: "Barbie: A Doll with a Dream",
    body: `In 1959, Ruth Handler, an American businesswoman, introduced Barbie to the world. Ruth noticed that her daughter loved playing with adult paper dolls instead of baby dolls. This gave her an idea: why not create a doll that could inspire girls to dream about their future? Ruth wanted Barbie to represent independence, ambition, and the idea that girls could be anything they wanted to be. However, the journey to success was not easy. Many people doubted her idea, saying, "No one will buy a doll with a woman's figure." Some critics argued that girls only wanted baby dolls to pretend to be mothers.

Barbie debuted at a toy fair in New York. She had blonde hair, a fashionable zebra-striped swimsuit, and high heels. At first, toy store owners were unsure if girls would like Barbie. Some wholesalers refused to stock the doll, but Ruth did not give up. She promoted Barbie in an innovative way: television commercials. When ads for Barbie aired on Disney's "Mickey Mouse Club," sales exploded. In just one year, over 350,000 Barbie dolls were sold, and Mattel, the company Ruth co-founded, quickly became one of the most successful toy manufacturers in the world.

Initially, Ruth wanted Barbie to show that girls could be anything. Barbie was not just a doll; she was a symbol of possibilities. In the 1960s, Barbie became a nurse, a stewardess, and even an astronaut, four years before humans landed on the moon. Each new role was designed to inspire girls to think beyond traditional gender roles. Barbie encouraged them to imagine careers and futures that went beyond being wives and mothers.

Subsequently over time, Barbie's career choices expanded. She has worked in over 250 different professions, including scientist, president, and even robotics engineer. Each career reflected changing times and values, allowing Barbie to stay relevant. For example, in the 1990s, Barbie became a computer engineer, and in recent years, she has been portrayed as a sustainability advocate, promoting environmental awareness. Through her various roles, Barbie continues to inspire girls to dream big and explore new possibilities.

Despite her success, Barbie has faced criticism. In the 1970s, feminists argued that Barbie created unrealistic body standards. Her figure, with an impossibly tiny waist and long legs, did not represent real women. Researchers pointed out that if Barbie were a real woman, her body proportions would prevent her from standing or living healthily. Some even calculated that her BMI would be so low that she could not menstruate. This sparked debates about the impact of Barbie on young girls' self-esteem.

People also criticized Barbie for promoting traditional gender roles. For example, one version of Barbie came with a cookbook and instructions for staying slim that said, "Don't eat." Critics argued that this message encouraged unhealthy habits and reinforced harmful stereotypes. Additionally, Barbie's early designs often portrayed beauty standards that excluded diversity. For many years, Barbie was blonde-haired and blue-eyed, leading to accusations of promoting a narrow view of beauty.

Therefore, Mattel began to make changes to address these concerns. In the 1980s, they introduced Black Barbie to celebrate diversity and inclusivity. By 2016, Barbie dolls were available in different body types: "curvy," "petite," and "tall." Today, Barbie comes in 35 skin tones and has hairstyles ranging from afros to straight hair. Mattel has also introduced dolls with wheelchairs, prosthetic limbs, and hearing aids. These changes ensure that all children can see themselves reflected in Barbie's world.

Barbie remains the best-selling doll in the world. In 2021 alone, Mattel sold 86 million Barbie dolls, which means about 164 dolls were sold every minute. Barbie's success is not just about toys; she has become a cultural icon. Over the years, Barbie has appeared in countless books, TV shows, and movies. In 2023, a live-action Barbie movie directed by Greta Gerwig became a blockbuster hit, inspiring a new generation of fans. The film explored themes of identity and empowerment, showing that Barbie is more than just a doll; she is a symbol of creativity and resilience.

In addition, Barbie's influence extends beyond entertainment. She has inspired fashion designers, artists, and even activists. Many special edition Barbies have been created to honor real-life role models, such as scientists, athletes, and activists. These dolls celebrate achievements and encourage children to aspire to greatness. For example, a Barbie was created to honor astronaut Sally Ride, the first American woman in space, showing girls that the sky is not the limit.

Barbie's journey is a story of change and adaptation. From her early days as a fashion model to her role as a global icon, Barbie has shown that girls can be anything they want to be. Even with challenges and criticisms, she has remained a symbol of possibility and imagination. As Ruth Handler once said, "Barbie always represented the fact that a woman has choices." Her legacy continues to evolve, reflecting the dreams and aspirations of each new generation.`
  },
  {
    id: "gaga",
    title: "From Pain to Fame (Lady Gaga)",
    body: `Lady Gaga is famous for songs like "Just Dance," but her life wasn't always easy. Before becoming a movie star, Gaga faced many problems, including heartbreaks, illness, and criticism about her body. She started singing in 2008 and quickly became popular, yet ten years later, her life changed again when she began acting in movies.

In 2018, Gaga acted in the movie "A Star is Born," and critics loved her performance. She even won awards for her role. However, getting this role was difficult because a movie executive didn't think Gaga was right for the part. Gaga had to prove herself in a screen test. She worked hard, passed the test, and got the role. This experience showed how strong Gaga is, and she proudly stated she enjoys proving people wrong.

Despite her successes, Gaga's life was not free from sadness and challenges. In 2016, she ended her relationship with actor Taylor Kinney. At the same time, she released a very personal album called "Joanne," expressing deep sadness. Gaga also shared these feelings in her documentary "Gaga: Five Foot Two."

Moreover, while her career was growing, Gaga struggled with health issues. She suffers from fibromyalgia, a disease that causes body pain. Because of this illness, Gaga canceled many concerts. After performing at the Super Bowl, people criticized her body, worsening her emotional state. Yet, Gaga responded strongly, encouraging people to be proud of themselves.

Fortunately, today Gaga feels better, thanks to expert doctors who have helped manage her illness. She has found happiness again with her fiancé, venture capitalist Michael Polansky. Her movie career continues to be successful, and she has performed a residency in Las Vegas. Gaga achieved these dreams despite the challenges she faced.

In conclusion, Lady Gaga's journey from difficult times to worldwide success has made her a major figure in music and popular culture today. With millions of fans, countless awards, and groundbreaking performances, Gaga remains a powerful example of resilience and creativity. Her story teaches us that even the hardest times can lead to amazing successes, continuing to inspire people everywhere.`
  },
  {
    id: "leadership",
    title: "Leading with Vision (Transformational Leaders)",
    body: `Some leaders are more than just bosses. They do more than tell people what to do. These special leaders are called transformational leaders. They help people believe in a big idea and work together to reach a shared goal. They also help people grow, learn, and feel more confident in their work. Transformational leaders are often inspiring, positive, and clear about their ideas. They help others feel excited and proud to be part of something important. They don't just give orders. Instead, they listen, help, and guide people to be their best.

A big part of being a good transformational leader is building strong relationships. These leaders understand how their team feels. They care about people's needs and listen to their concerns. Because of this, people trust them and feel loyal to them. Moreover, when there is trust, teams work better. People feel safe to share ideas, try new things, and ask for help when needed. This creates a team that works well together and keeps getting better.

Transformational leaders have a strong vision for the future. A vision is a big idea about what they want to achieve. They know where they want to go, and they help others see it too. They talk about this vision in a way that makes people want to be part of it. Also, they help their team understand the steps needed to reach the goal. They break big goals into smaller, easier tasks. In this way, people can see their progress and stay motivated.

Good communication is another important part of transformational leadership. These leaders speak clearly and with energy. They can explain their ideas in a way that excites others. But they don't just talk, they also listen. They ask for ideas and feedback from their team. This shows people that their voices matter. It also helps the leader make better decisions because they hear different points of view.

Transformational leaders do not only think about the job, they also think about the people doing the job. They help their team grow by giving advice, sharing tools, or teaching new skills. They also give praise and encouragement. When people feel supported, they are more likely to try hard and stay positive. Leaders who help their team members improve are often respected and loved.

This style of leadership is useful in many different places. A transformational leader can work in a business, a school, a hospital, or even a government office. No matter where they are, they can help teams do great things. Because they are flexible and thoughtful, transformational leaders can work well with many kinds of people. They don't try to control everything. Instead, they guide others and make space for teamwork.

Many famous people are known as transformational leaders. One well-known example is Nelson Mandela. He fought against unfair laws in South Africa. Even after spending years in prison, he brought people together to work for peace and equality. He shared a strong vision and inspired millions of people to believe in a better future. Another example is Steve Jobs, the co-founder of Apple. He had big ideas about how technology could help people. He was good at talking about his vision and helping others believe in it. He also created a company culture where people wanted to be creative and do excellent work.

Transformational leadership is about more than being in charge. It is about lifting others. These leaders connect with people, share exciting ideas, and help teams grow. They show us that when people feel inspired and supported, they can do amazing things. In today's world, we need more leaders who care, who listen, and who believe in the power of teamwork. Transformational leaders remind us that good leadership is not just about power, it is about helping others shine.`
  },
  {
    id: "leanin",
    title: "Lean In: Women, Work, and the Will to Lead",
    body: `Sheryl Sandberg's book, Lean In: Women, Work, and the Will to Lead, discusses gender inequality at work. She explains how women often face career challenges while balancing family responsibilities. Sandberg shares her personal stories and research to show why fewer women hold top leadership roles, even though many women are successful in school and work. She encourages women to believe in themselves and challenge society's expectations.

One key idea in the book is the "jungle gym" metaphor for careers. Sandberg says that careers don't always grow in a straight line like climbing a ladder. Instead, they can go in different directions, like climbing a jungle gym. She highlights the value of mentors in helping women grow professionally and advises women to take charge of their careers. Sandberg also talks about the importance of honesty at work. She believes open communication helps create better workplaces. For work-life balance, she suggests focusing on getting things done instead of trying to be perfect.

In conclusion, Sandberg's Lean In encourages women to take leadership roles and speak up for themselves. She also stresses the need for honest workplaces and realistic expectations about work-life balance. By following these principles, women can achieve success both at work and in their personal lives.`
  },
  {
    id: "creativity",
    title: "More Than a Muse: What It Really Means to Be Creative",
    body: `In the past, people didn't understand where creative ideas came from. The ancient Greeks believed creativity came from goddesses called muses. They thought different muses gave people ideas for poetry, music, or dance. Today, people sometimes use the word "muse" to describe a person who inspires them. But this old idea doesn't explain how humans create art, science, or inventions. Today, scientists try to study creativity using facts and experiments.

We often connect creativity with artists, but it is important in many jobs. People who solve problems and think of new ideas are being creative, even if they are not painters or musicians. Still, it is hard to give one clear definition of creativity. Scientists continue to explore what happens in our brains during creative moments.

In the 1950s, researchers started to study creativity seriously. They agreed that something is creative if it is both original and effective. "Original" means that it is new and different. "Effective" means it is useful or has a clear purpose. If something is only new but not useful, it is not really creative.

Some scientists believe that creativity must also be understood by others. For example, if someone makes a strange painting that no one understands, it may be original, but not creative. However, some disagree. Researcher Mark Runco believes a person can be creative even without an audience. He talks about two kinds of creativity. "Primary creativity" is when a person has a new idea. "Secondary creativity" happens when that idea is shared and accepted by others.

Dr. Jonathan Fineberg has a simple definition. He says creativity is the ability to look at problems in new ways. You don't need to be an artist or a scientist to be creative. You can be creative while cooking, dressing, or solving everyday problems. Fineberg also believes creativity has a biological side. Our brains take in many things, what we see, hear, smell, and feel. Creativity is about putting all that information together in a new way. It can be used in any job, from doctors to salespeople. What matters is the ability to adapt and find new solutions.

In his book Imagine: How Creativity Works, writer Jonah Lehrer explains how scientists have studied moments of creative insight. Researchers Mark Beeman and John Kounios asked people to solve puzzles while measuring their brain activity. At first, the logical left side of the brain became active. But when people got stuck, the activity moved to the right side, which helps with imagination and expression. Just before they found the answer, their brains gave off a burst of gamma waves, fast brain signals that show new ideas are forming. This shows that creative ideas are not sudden magic, they are the result of the brain working hard and making new connections.

You might wonder why scientists care so much about creativity. It is not something that helps us stay alive, like eating or sleeping. But researcher Mihaly Csikszentmihalyi says creativity is one of the most important parts of being human. Creativity makes humans different from animals. We are the only creatures who paint, write books, invent machines, and solve crosswords. Creativity gives life meaning. Artists, scientists, and inventors often feel deep joy when they are working. Csikszentmihalyi says that creative work can feel as exciting as music, sports, or even religious experiences. But more than that, creativity leaves something behind. It builds the future.

So, what does it actually mean to be creative? Scientists still don't fully agree, but most say that creativity is more than just having new ideas. It's about using those ideas in helpful, meaningful ways. It can come from anyone and appear in any part of life, from science labs to kitchens. As we continue to explore creativity, we learn more about what makes us human and how we can shape a richer and more interesting world for tomorrow.`
  },
  {
    id: "guitar",
    title: "The Guitar That Changed Music",
    body: `The Fender Stratocaster is probably the most famous electric guitar in the world. It was first introduced in 1954 by Leo Fender. The guitar was designed to be easy to play and to have an unusual, modern, space-age look. The design included a comfortable shape and special features, like three pickups for different sounds. The guitar was both unique and innovative, and remains extremely popular over 75 years later.

Initially, the unusual Stratocaster was not widely adopted. Many musicians preferred other, more traditional guitars. However, popular artists, like Buddy Holly, started to use it in the 1950s, and when people saw it on TV, more musicians became interested. It quickly became a favorite for rock and pop music. Over time, it showed how powerful and exciting an electric guitar could be.

Today, the Stratocaster is a symbol of creativity and rock music. Famous players like Jimi Hendrix used it to create new sounds that changed music forever. Today, it is loved by guitarists everywhere. The Stratocaster shows how a good idea, dedication to innovation, and quality design can change the world.`
  },
  {
    id: "taylor",
    title: "The Power of Inspiration (Taylor Swift)",
    body: `Taylor Swift has become one of the world's most famous and admired women. Her personality and unique music have touched the lives of millions. Whether or not you enjoy her songs, it is easy to see why she is so popular. She encourages people to embrace who they are and to follow their dreams without fear. Many young women look up to her because she shows that success can look different for everyone.

One of the things that makes Taylor Swift so special is her kindness and honesty. She is not afraid to show her true self, which helps others feel confident about being themselves, too. Her songs often talk about friendship, dreams, and facing challenges. She also encourages people to support each other. For example, she is still close friends with Abigail, someone she sang about when she was only 15. This shows the importance of building and maintaining strong friendships.

Taylor's story inspires young women to believe in their potential and work hard to reach their goals. Her success reminds us that women can be powerful, creative, and confident in their own way. Even after she leaves a city, her influence remains, pushing fans to celebrate ambition, kindness, and teamwork. Like Taylor, we can all inspire each other to do amazing things.`
  },
  {
    id: "doughnut",
    title: "The Story of the Doughnut",
    body: `Dough fried in oil is popular in many places. In Morocco, it's called sfenj, in Greece loukoumades, and in India jalebi. But in North America in the early 1900s, it was not very common. Doughnuts were only eaten in some parts of the country. However, today, doughnuts are everywhere in the U.S., in offices, at police stations, and in trendy cafés. But did you know that doughnuts became famous all over the world because of a war?

When the United States joined World War I, a group called the Salvation Army sent women to support soldiers in France, but mainly to raise morale. These women were told to pray with the soldiers, sing songs, comfort them, and help them feel better. Life on the battlefield was very hard. It was rainy, cold, and often dangerous. The soldiers were tired and sad.

To make the men feel happier, the women made warm drinks like cocoa and simple desserts like apple pie. However, pies were difficult to bake near the battlefield. So, in September 1917, one woman had an idea. Why not make doughnuts instead? The dough was easy to mix, and they could fry them in a steel army helmet filled with hot fat.

The women made the dough, rolled it out with a bottle, and cut it into rings using a can. They used a funnel to make the hole in the middle. The doughnuts were covered in sugar and served hot. The soldiers loved them right away. The women became known as the "doughnut Sallies." These sweet, warm treats made the men feel like they were home again.

Despite only 250 women working near the battlefield, they had a disproportionate effect. One army officer said that every soldier felt like his mother was just behind the lines, making doughnuts just for him. The U.S. army always made sure the women had everything they needed, even when food was scarce for the local French people.

Back in America, people heard about these doughnuts. Songs like My Doughnut Girl and films showed women giving doughnuts to sick and wounded soldiers. The public loved this idea. Soon, many people wanted to eat doughnuts. Businesses started selling them, and people began making doughnuts at home with commercial baking mixes.

In the 1920s and during the Great Depression, the Salvation Army sold doughnuts to raise money. When World War II began, the Salvation Army and the Red Cross again gave out doughnuts to soldiers. This time, they used machines to make the doughnuts faster and in larger numbers.

After the wars, doughnuts became a part of American life. They were easy to make and eat. This fitted well with a country that was changing. More women worked outside the home, and cars made travel easier. Over time, new and fun versions of doughnuts appeared. Today, you can find doughnuts with many colors, fillings, and shapes. Just visit a modern café, and you'll see.

The doughnut may be sweet and simple, but its history is full of meaning. From war zones to city cafés, it has helped bring comfort, joy, and community. So, next time you eat a doughnut, think about the long road it took to get there.`
  },
  {
    id: "sleep",
    title: "The Work We Do While We Sleep",
    body: `It is strange to think that we spend almost a third of our lives asleep. Why do we do this? During sleep, we are not alert and cannot protect ourselves. In history, people often questioned the purpose of sleep. For example, Benjamin Franklin once joked that there would be "enough sleeping in the grave." For a long time, even scientists found sleep's purpose mysterious. Some thought it was only useful to stop us from feeling tired. Others doubted it had any real importance at all.

However, recently, researchers have started to understand more about sleep. They now believe that sleeping and dreaming play key roles in our health and minds. But how exactly does sleep help us?

One way to study the importance of sleep is by looking at what happens when it is disturbed. Some people have sleep disorders, such as REM-sleep behavior disorder. Normally, our bodies stay still when we dream, but in this disorder, people move and act out their dreams. This condition is often linked to diseases like Parkinson's. Another example is sleep apnea, where breathing stops for short periods during sleep. Sleep apnea has been connected to serious health problems, including heart disease and diabetes. Chronic insomnia, or not being able to sleep well for a long time, is another example. It is linked to depression, poor memory, and other health issues.

The aforementioned conditions show that sleep is necessary for both physical and mental health. Problems with sleep can affect our hearts, our ability to think, and even our mood. This suggests that sleep helps the body recover and stay strong.

Sleep also plays a major role in memory and learning. In one famous study, participants played a computer game called Tetris for hours. That night, they dreamed of falling shapes. Even people with memory loss who could not remember playing the game still dreamed of it. This showed that sleep helps the brain process and organize information, even if we are not aware of it.

Another experiment tested problem-solving. Participants learned a math problem but were not told there was an easier solution. After a break, those who slept were twice as likely to find the shortcut compared to those who stayed awake. Researchers believe that during sleep, the brain reviews what we have learned and helps us focus on important details. As one scientist said, "When we dream, we get the pieces. When we wake, we know the whole."

Sleep is also important for the body. In one study, the subjects, healthy men, were asked to sleep less than usual. After just two days, their heart health worsened. However, when sleep was restored, their heart function improved. This shows that good sleep can protect the heart and reduce stress on the body. Other studies have found that sleep helps clear toxins from the brain. These toxins, if not removed, could lead to diseases like Alzheimer's.

All of the above research points to one conclusion: while we sleep, our bodies and brains are hard at work. Sleep helps us stay healthy, solve problems, and remember what we learn. Yet, many people do not sleep enough. Some may not even know what it feels like to be fully rested.

If you often feel tired, ask yourself: Are you getting enough quality sleep? Sleep may seem like a time when nothing happens, but it is actually one of the most important parts of our lives. By sleeping well, we can improve our minds, our bodies, and our daily lives.`
  },
  {
    id: "aquaculture",
    title: "What Is Aquaculture?",
    body: `Aquaculture, also called water farming, is an industry that is growing quickly. Today, more than half of all the seafood we eat comes from aquaculture. This type of farming has been around for thousands of years and helps provide the protein that people need. It is also a way to reduce overfishing and make the oceans cleaner. Aquaculture involves farming seafood like fish, shellfish, and seaweed.

Seaweed farming is becoming popular because it is easy to do and does not harm the environment. Seaweed does not create much carbon, which helps protect the planet. Shellfish farming is also helpful because shellfish clean the water by taking out harmful substances. Fish farming is harder to manage because it needs special environments and methods. However, fish farms can sometimes cause water pollution, which can hurt the environment.

To solve these problems, people are coming up with new ideas. For example, in Norway, farmers are trying a new system. They raise salmon and seaweed together to keep the water clean. The goal is to make aquaculture better so it can feed more people in the future while also protecting the oceans.`
  },
  {
    id: "coke",
    title: "What's Really in Coca-Cola",
    body: `Coca-Cola is one of the most famous drinks in the world, but not many people know the story behind its ingredients. The name "Coca-Cola" comes from two plants: the coca leaf and the kola nut. The coca leaf is the source of cocaine, while the kola nut provides caffeine. These ingredients were part of the original recipe when the drink was created in the late 1800s. Although the recipe has changed over time, the connection to these ingredients remains part of Coca-Cola's history.

The coca leaf has been used in South America for hundreds of years to treat stomach problems, reduce hunger, and help with the effects of high altitudes. In the 1800s, chemists in Europe extracted cocaine from the coca leaf, turning it into a popular medicine and drug. Many products, including drinks, added cocaine to their recipes. One of these drinks was Vin Mariani, a wine mixed with cocaine. It inspired John Pemberton, the inventor of Coca-Cola, to create his own version by adding the kola nut.

Today, Coca-Cola does not contain cocaine, but the company still uses a special process involving coca leaves. This shows how the drink's history is closely linked to its unusual ingredients. Coca-Cola's story is more than just about soda, it's about science, culture, and a little bit of mystery.`
  }
];

const SYSTEM_PROMPT = `You are a kind, patient English tutor. Your students are non-native English speakers at the A1 to A2 level. They struggle to process a lot of information, so your feedback must be SHORT, SIMPLE, and EASY to understand. Imagine you are talking to a 12-year-old who is just learning English.

THE TASK
The student has read a text and written ONE sentence about its main idea. They are following this template:
"The text is about ___, and it shows that ___ [connector] ___."

Acceptable connectors include:
- Cause / result / reason: to, because, therefore, so
- Addition: and, additionally, as well as
- Contrast: however, but, although
- Example: for instance, for example

You will be told:
1. The full text the student read.
2. The student's sentence.
3. The attempt number (1, 2, 3, ...).

GRADING (out of 5 points)
- Content (0 to 2 points): Does the sentence capture A main idea of the text (not necessarily the deepest or most important one)?
  * 2 points: The sentence captures ANY reasonable main idea from the text. It does not have to be the "central" idea; a supporting main idea is fine. Depth is NOT required at this level.
  * 1 point: The sentence relates to the text but only captures a small detail, or is too vague to identify a main idea clearly.
  * 0 points: The sentence is off-topic, wrong about the text, or unrelated to what the text actually says.
- Vocabulary (0 to 1 point): Are the word choices appropriate?
- Sentence structure (0 to 1 point): Is it ONE sentence with a connector linking two ideas?
- Language (0 to 1 point): Is the grammar / syntax correct? CHECK CAREFULLY:
  * Capitalization: The first word must start with a capital letter. Proper nouns (names, places) must also be capitalized. Missing capitals lose this point.
  * Punctuation: The sentence must end with a period (.), question mark (?), or exclamation mark (!). BEFORE flagging a missing period, look at the VERY LAST character of the student's submission. If it is already ., ?, or !, then the punctuation is correct, so DO NOT flag it. Only flag missing punctuation if the last character is actually a letter or word.
  * Word order, verb tense, and agreement (subject-verb).
  Be lenient on creativity but STRICT on these basic mechanics, because beginners need to learn them.

GRADING RULES
- BE GENEROUS AND LENIENT on most things. These are beginners.
- Award full points if the work is mostly right, even with small flaws.
- Small spelling slips do not always mean 0. Use judgment.
- HOWEVER, do NOT be lenient about: a missing capital letter at the start of the sentence, a missing period at the end of the sentence, or proper nouns not capitalized. These are basic mechanics that students must practice. Always flag them in the issues list.
- The structure point is earned if the sentence has the spirit of "topic + idea + connector". The exact wording of the template does not have to match.
- If the student writes more than one sentence, the structure point is 0, but explain this kindly.
- CONTENT IS ESPECIALLY LENIENT: In an exam context, students at this level have limited vocabulary and cannot always express nuance. If the sentence captures ANY reasonable idea from the text, award full content points. Do NOT deduct content points for "could have said more" or "could go deeper". You may add a suggestion for how to strengthen it, but that suggestion belongs in the issues list ONLY IF you also lost a point somewhere. If content is 2/2, do not add a content issue at all.

FEEDBACK RULES (CRITICAL)
- For attempts 1, 2, and 3: NEVER write a fully correct sample sentence. Set sampleSentence to null.
- Identify each error and EXPLAIN what is wrong, in very simple words.
- Give a HINT for how to fix it. Do NOT give the corrected sentence. For example, say "Check the spelling of 'wieght'. The 'i' and 'e' are in the wrong order." but never write the corrected sentence yourself.
- Always include a positive note in the encouragement field.
- Use very short, simple words and sentences in your feedback. Avoid long explanations.

ON ATTEMPT 4 OR LATER, if the student still has not reached 5/5:
- You MAY include ONE fully correct sample sentence in sampleSentence to show them how it could look.
- Otherwise, sampleSentence is null.

If the student scores 5/5 at any attempt: sampleSentence is null and the encouragement should celebrate them.

EMOJIS IN THE ENCOURAGEMENT
Add ONE friendly emoji at the START of your encouragement to make it warm.
- For a 5/5 score, use a celebration emoji like 🎉, 🎊, ⭐, or ✨.
- For 3 or 4 out of 5, use a warm encouraging emoji like 👍, 💪, or 🌟.
- For 1 or 2 out of 5, use a kind, supportive emoji like 🌱, 💛, or 🤗.
- Use only ONE emoji. Do not put emojis inside the issues or hints, only in the encouragement.

OUTPUT FORMAT
You MUST respond with VALID JSON ONLY. No preamble. No markdown fences. No extra text.

PUNCTUATION RULE FOR YOUR OWN WRITING: Every sentence you write in the encouragement, what, and hint fields MUST end with a period (.), exclamation mark (!), or question mark (?). Never leave a sentence without end punctuation. This applies to your own words, not to the student's submission.

Use this exact schema:

{
  "scores": {
    "content": <0, 1, or 2>,
    "vocabulary": <0 or 1>,
    "structure": <0 or 1>,
    "language": <0 or 1>
  },
  "totalScore": <sum of the four scores>,
  "encouragement": "<one short positive sentence, max 15 words>",
  "issues": [
    {
      "category": "<content | vocabulary | structure | language>",
      "what": "<one short sentence saying what is wrong, max 20 words>",
      "hint": "<one short sentence telling them how to think about fixing it, max 25 words>"
    }
  ],
  "sampleSentence": <null or a string with one fully correct sample sentence>
}

If the student scored full points in a category, do NOT include an issue for that category. Only include issues for categories where points were lost.`;

const TEMPLATE_TEXT = "the text is about ________, and it shows that ________ [connector] ________";

function buildUserPrompt(text, sentence, attemptNumber) {
  return `TEXT THE STUDENT READ:
"""
${text}
"""

STUDENT'S SENTENCE (attempt #${attemptNumber}):
"""
${sentence}
"""

Grade this sentence using the rubric. Remember the rules about sample sentences (never before attempt 4). Respond with JSON only.`;
}

// Catches the most common "oops" submissions before they hit the API.
// Returns a friendly error string, or null if the submission looks ready to grade.
function validateSubmission(text) {
  // 1. Are there still long blank-style underscores in the text?
  if (/_{3,}/.test(text)) {
    return "⚠️ It looks like you have not filled in all the blanks yet. Please replace each ________ with your own words before getting feedback.";
  }

  // 2. Did they leave the [connector] placeholder in?
  if (/\[connector\]/i.test(text)) {
    return "⚠️ Please replace [connector] with a real connecting word, like 'because', 'and', 'but', or 'however'.";
  }

  return null;
}

// Ensure any text field ends with valid sentence-final punctuation.
// The model is instructed to punctuate but occasionally slips; this
// silently fixes it so students never see an unpunctuated hint.
function ensureEndPunct(text) {
  if (!text || typeof text !== "string") return text;
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const last = trimmed.slice(-1);
  if (last === "." || last === "!" || last === "?") return trimmed;
  return trimmed + ".";
}

// Defensive cleanup of AI feedback. The model sometimes hallucinates a
// "missing period" issue even when the sentence already ends correctly.
// We strip such false positives and refund the language point if needed.
// We also normalize punctuation on all AI-written text fields (encouragement,
// issue "what", issue "hint") so students never see an unpunctuated sentence.
function sanitizeFeedback(feedback, submission) {
  if (!feedback || !feedback.issues) return feedback;

  // Normalize punctuation on every AI-written text field. This runs on
  // every response, regardless of the false-positive branch below.
  const punctFixedIssues = feedback.issues.map(issue => ({
    ...issue,
    what: ensureEndPunct(issue.what),
    hint: ensureEndPunct(issue.hint)
  }));
  const punctFixedFeedback = {
    ...feedback,
    encouragement: ensureEndPunct(feedback.encouragement),
    issues: punctFixedIssues
  };

  // Does the submission already end in valid sentence-final punctuation?
  const trimmed = submission.trim();
  const lastChar = trimmed.slice(-1);
  const endsCorrectly = lastChar === "." || lastChar === "!" || lastChar === "?";
  if (!endsCorrectly) return punctFixedFeedback;

  // Conservative regex: must mention a punctuation word AND an
  // action verb that asks for the punctuation to be added/fixed.
  // This avoids matching capitalization hints that merely reference
  // periods as positional markers ("a capital after a period").
  const PUNCT_WORD = /\b(period|full\s*stop|punctuation|punctuate)\b/i;
  const ACTION_VERB = /\b(missing|forgot|forget|add|need|needs|needed|put|include|finish|end\s+with|should\s+(have|end|add|put|include))\b/i;

  const filteredIssues = punctFixedFeedback.issues.filter(issue => {
    const blob = `${issue.what || ""} ${issue.hint || ""}`;
    const isFalsePositive = issue.category === "language" && PUNCT_WORD.test(blob) && ACTION_VERB.test(blob);
    return !isFalsePositive;
  });

  // If we removed any issues AND the only language issue was the bogus one,
  // refund the language point (max 1 in main idea rubric).
  const removed = punctFixedFeedback.issues.length - filteredIssues.length;
  if (removed === 0) return punctFixedFeedback;

  const stillHasLanguageIssue = filteredIssues.some(i => i.category === "language");
  const newScores = { ...punctFixedFeedback.scores };
  if (!stillHasLanguageIssue && newScores.language < 1) {
    newScores.language = 1;
  }
  const newTotal = newScores.content + newScores.vocabulary + newScores.structure + newScores.language;

  return {
    ...punctFixedFeedback,
    scores: newScores,
    totalScore: newTotal,
    issues: filteredIssues
  };
}

function ScoreRing({ score, max = 5 }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = score / max;
  const offset = circumference * (1 - progress);
  const color = score === 5 ? "#2D5043" : score >= 3 ? "#7A6B2A" : "#B85C38";
  return (
    <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#E8E0D0" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 48 48)"
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center", flexDirection: "column",
        fontFamily: "'Fraunces', serif"
      }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: "#1F1B16", lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 11, color: "#6B5D54", marginTop: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.05em" }}>OF {max}</div>
      </div>
    </div>
  );
}

function CategoryBar({ label, score, max }) {
  const pct = (score / max) * 100;
  const earned = score === max;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "#1F1B16", fontWeight: 500 }}>{label}</span>
        <span style={{
          fontSize: 12, color: earned ? "#2D5043" : "#8A6F30",
          fontVariantNumeric: "tabular-nums", fontWeight: 500
        }}>
          {score} / {max}
        </span>
      </div>
      <div style={{ height: 6, background: "#EFE7D6", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: earned ? "#2D5043" : "#C99452",
          transition: "width 0.5s ease"
        }} />
      </div>
    </div>
  );
}

const CATEGORY_LABELS = {
  content: "Content",
  vocabulary: "Vocabulary",
  structure: "Sentence structure",
  language: "Language (grammar)"
};

const CATEGORY_EMOJIS = {
  content: "💭",
  vocabulary: "📖",
  structure: "🧩",
  language: "✏️"
};

const CATEGORY_DOTS = {
  content: "#B85C38",
  vocabulary: "#7A6B2A",
  structure: "#2D5043",
  language: "#5A4A8A"
};

export default function App({ onBack }) {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [teacher, setTeacher] = useState("");
  const [welcomed, setWelcomed] = useState(false);
  const [sessionBest, setSessionBest] = useState(0);
  const [logError, setLogError] = useState(null);
  const [selectedTextId, setSelectedTextId] = useState("");
  useEffect(() => { _setLogError = setLogError; }, []);
  const [studentSentence, setStudentSentence] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editText, setEditText] = useState("");
  const feedbackRef = useRef(null);

  const selectedText = TEXTS.find(t => t.id === selectedTextId);
  const attemptNumber = attempts.length + 1;

  useEffect(() => {
    if (currentFeedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentFeedback]);

  // Single call to the API + parse pipeline. Returns the parsed feedback
  // object on success or throws with a descriptive message on failure.
  // Routed through the Vercel proxy so the Anthropic API key stays server-side.
  const callGrader = async (userPrompt, trimmedSubmission) => {
    const response = await fetch("https://writing-app-logger.vercel.app/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}: ${bodyText.slice(0, 200)}`);
    }

    const data = await response.json();
    const rawResp = (data.content || [])
      .filter(b => b && b.type === "text")
      .map(b => b.text)
      .join("");

    if (!rawResp) {
      throw new Error("Empty response from grader.");
    }

    const cleaned = rawResp.replace(/```json/gi, "").replace(/```/g, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    const jsonStr = firstBrace >= 0 && lastBrace > firstBrace
      ? cleaned.slice(firstBrace, lastBrace + 1)
      : cleaned;

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      throw new Error(`Grader returned invalid JSON: ${jsonStr.slice(0, 200)}`);
    }

    // Basic shape validation so we fail loudly instead of silently
    // rendering a broken feedback UI.
    if (!parsed.scores || typeof parsed.totalScore !== "number") {
      throw new Error("Grader response is missing required fields.");
    }

    return sanitizeFeedback(parsed, trimmedSubmission);
  };

  const handleSubmit = async (sourceText) => {
    // Default to the top-of-page textarea, but allow the feedback-inline
    // editor to pass its own current value directly.
    const raw = typeof sourceText === "string" ? sourceText : studentSentence;
    const trimmed = raw.trim();
    if (!trimmed || !selectedText || isLoading) return;

    // Catch obvious "I forgot something" submissions before they hit the API.
    const validationError = validateSubmission(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    const userPrompt = buildUserPrompt(selectedText.body, trimmed, attemptNumber);

    // Retry once on failure. Transient network hiccups and occasional
    // malformed JSON from the model are the two failure modes we see;
    // a second attempt clears both the vast majority of the time.
    let feedback = null;
    let lastErr = null;
    for (let attemptIdx = 0; attemptIdx < 2; attemptIdx++) {
      try {
        feedback = await callGrader(userPrompt, trimmed);
        break;
      } catch (e) {
        lastErr = e;
        console.error(`Grader call failed (attempt ${attemptIdx + 1}):`, e);
      }
    }

    if (feedback) {
      setCurrentFeedback(feedback);
      const nextBest = Math.max(sessionBest, feedback.totalScore);
      setSessionBest(nextBest);
      setAttempts(prev => [...prev, { sentence: trimmed, feedback }]);
      logToAirtable({
        firstName,
        surname,
        teacher,
        textTitle:     selectedText.title,
        attemptNumber: attempts.length + 1,
        submission:    trimmed,
        totalScore:    feedback.totalScore,
        sessionBest:   nextBest,
        scores:        feedback.scores,
      });
      setStudentSentence(trimmed);
      setEditText(trimmed);
    } else {
      const msg = lastErr && lastErr.message ? lastErr.message : "unknown error";
      setError(`Sorry, something went wrong getting your feedback. Please try again in a moment. (${msg.slice(0, 120)})`);
    }
    setIsLoading(false);
  };

  const handleTryAgain = () => {
    // Grade the edited version. Don't clear anything; the student is
    // iterating on this same attempt in place.
    handleSubmit(editText);
  };

  const handleNewText = () => {
    setSelectedTextId("");
    setStudentSentence("");
    setAttempts([]);
    setCurrentFeedback(null);
    setError(null);
    setEditText("");
    setSessionBest(0);
  };

  const handleSelectText = (id) => {
    setSelectedTextId(id);
    setStudentSentence("");
    setAttempts([]);
    setCurrentFeedback(null);
    setError(null);
    setEditText("");
    setSessionBest(0);
  };

  const handleUseTemplate = (templateText) => {
    setStudentSentence(templateText);
  };

  const cardStyle = {
    background: "#FFFFFF",
    border: "1px solid #E8E0D0",
    borderRadius: 14,
    padding: "22px 26px",
    marginBottom: 18
  };

  const stepNumberStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "#2D5043",
    color: "#FAF6ED",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    marginRight: 10,
    flexShrink: 0
  };

  const stepTitleStyle = {
    display: "flex",
    alignItems: "center",
    fontFamily: "'Fraunces', serif",
    fontSize: 20,
    fontWeight: 500,
    color: "#1F1B16",
    margin: 0,
    marginBottom: 14,
    letterSpacing: "-0.01em"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF6ED",
      padding: "32px 20px 60px",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      color: "#1F1B16"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }
        body { margin: 0; }

        .mit-textarea {
          width: 100%;
          min-height: 110px;
          padding: 14px 16px;
          border: 1.5px solid #DDD2BC;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px;
          line-height: 1.55;
          color: #1F1B16;
          background: #FDFAF2;
          resize: vertical;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .mit-textarea:focus {
          border-color: #2D5043;
          box-shadow: 0 0 0 3px rgba(45, 80, 67, 0.12);
        }
        .mit-textarea::placeholder { color: #A89B85; }

        .mit-select {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #DDD2BC;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          color: #1F1B16;
          background: #FDFAF2;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%236B5D54' d='M6 8L0 0h12z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }
        .mit-select:focus {
          border-color: #2D5043;
          box-shadow: 0 0 0 3px rgba(45, 80, 67, 0.12);
        }

        .mit-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.08s ease, background 0.15s ease, opacity 0.15s ease;
          border: none;
          letter-spacing: 0.01em;
        }
        .mit-btn:active:not(:disabled) { transform: translateY(1px); }
        .mit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .mit-btn-primary { background: #2D5043; color: #FAF6ED; }
        .mit-btn-primary:hover:not(:disabled) { background: #234037; }

        .mit-btn-secondary {
          background: transparent;
          color: #2D5043;
          border: 1.5px solid #2D5043;
        }
        .mit-btn-secondary:hover:not(:disabled) { background: rgba(45, 80, 67, 0.06); }

        .mit-btn-template {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #2D5043;
          background: rgba(45, 80, 67, 0.08);
          border: 1px solid rgba(45, 80, 67, 0.3);
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.08s ease;
        }
        .mit-btn-template:hover { background: rgba(45, 80, 67, 0.16); }
        .mit-btn-template:active { transform: translateY(1px); }

        .mit-text-body {
          font-size: 15px;
          line-height: 1.7;
          color: #2A2520;
        }
        .mit-text-body p { margin: 0 0 12px 0; }
        .mit-text-body p:last-child { margin-bottom: 0; }

        .mit-spin {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(250, 246, 237, 0.4);
          border-top-color: #FAF6ED;
          border-radius: 50%;
          animation: mit-spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: -2px;
        }
        @keyframes mit-spin { to { transform: rotate(360deg); } }

        .mit-fade-in { animation: mit-fade-in 0.4s ease both; }
        @keyframes mit-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        <header style={{ marginBottom: 24, paddingLeft: 6 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: "#6B5D54",
                padding: "0 0 12px 0",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              ← Back to menu
            </button>
          )}
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 32,
            fontWeight: 500,
            margin: 0,
            letterSpacing: "-0.02em",
            color: "#1F1B16"
          }}>
            Main Idea Writing Tutor
          </h1>
          <p style={{
            fontSize: 15,
            color: "#6B5D54",
            margin: "6px 0 0 0",
            lineHeight: 1.5,
            maxWidth: 560
          }}>
            Practice writing one clear sentence about the main idea of a text. Get friendly feedback, then try again.
          </p>
        </header>

        {!welcomed ? (
          <section style={cardStyle} className="mit-fade-in">
            <h2 style={stepTitleStyle}>
              <span style={stepNumberStyle}>👋</span>
              Welcome! Please introduce yourself.
            </h2>
            <p style={{ fontSize: 14.5, color: "#5A4D43", marginBottom: 18, lineHeight: 1.6 }}>
              Fill in all three fields to begin. 😊
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B5D54", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
                  First name
                </label>
                <input
                  type="text"
                  className="mit-select"
                  style={{ fontSize: 15, padding: "11px 14px", width: "100%" }}
                  placeholder="e.g. Yuval"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B5D54", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
                  Surname
                </label>
                <input
                  type="text"
                  className="mit-select"
                  style={{ fontSize: 15, padding: "11px 14px", width: "100%" }}
                  placeholder="e.g. Cohen"
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B5D54", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
                My teacher is
              </label>
              <select
                className="mit-select"
                value={teacher}
                onChange={e => setTeacher(e.target.value)}
              >
                <option value="">Select your teacher...</option>
                <option value="Daniel">Daniel</option>
                <option value="Keren">Keren</option>
              </select>
            </div>

            <div style={{ textAlign: "right" }}>
              <button
                className="mit-btn mit-btn-primary"
                disabled={!firstName.trim() || !surname.trim() || !teacher}
                onClick={() => setWelcomed(true)}
              >
                Start ➜
              </button>
            </div>

            {(!firstName.trim() || !surname.trim() || !teacher) && (firstName || surname || teacher) && (
              <div style={{ marginTop: 12, fontSize: 13, color: "#8A6F30", fontStyle: "italic" }}>
                Please fill in all three fields to continue.
              </div>
            )}
          </section>
        ) : (
          <>
            <div style={{
              fontSize: 13,
              color: "#6B5D54",
              marginBottom: 18,
              paddingLeft: 6,
              display: "flex",
              gap: 16,
              alignItems: "center"
            }}>
              <span>👤 <strong style={{ color: "#1F1B16" }}>{firstName} {surname}</strong></span>
              <span>📚 <strong style={{ color: "#1F1B16" }}>{teacher}'s class</strong></span>
            </div>

            {logError && (
              <div style={{
                marginBottom: 14,
                padding: "8px 14px",
                background: logError.startsWith("Log OK") ? "#E8EFE9" : "#F8E5DC",
                border: `1px solid ${logError.startsWith("Log OK") ? "#B5C9B8" : "#E0B8A0"}`,
                borderRadius: 8,
                fontSize: 13,
                color: logError.startsWith("Log OK") ? "#2D5043" : "#7A3818"
              }}>
                {logError.startsWith("Log OK") ? "✅ " : "⚠️ "}{logError}
              </div>
            )}

        <section style={cardStyle}>
          <h2 style={stepTitleStyle}>
            <span style={stepNumberStyle}>1</span>
            📚 Choose a text to write about
          </h2>
          <select
            className="mit-select"
            value={selectedTextId}
            onChange={(e) => handleSelectText(e.target.value)}
          >
            <option value="">Select a text from the list...</option>
            {TEXTS.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </section>

        {selectedText && (
          <section style={cardStyle} className="mit-fade-in">
            <h2 style={stepTitleStyle}>
              <span style={stepNumberStyle}>2</span>
              👀 Read the text
            </h2>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 22,
              fontWeight: 500,
              marginBottom: 14,
              color: "#1F1B16",
              letterSpacing: "-0.01em"
            }}>
              {selectedText.title}
            </div>
            <div style={{
              maxHeight: 320,
              overflowY: "auto",
              padding: "16px 20px",
              background: "#FDFAF2",
              border: "1px solid #EDE3CE",
              borderRadius: 10
            }}>
              <div className="mit-text-body">
                {selectedText.body.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {selectedText && (
          <section style={cardStyle} className="mit-fade-in">
            <h2 style={stepTitleStyle}>
              <span style={stepNumberStyle}>3</span>
              ✍️ Write your sentence
            </h2>

            <div style={{
              background: "#F4EEDC",
              border: "1px dashed #C9B98F",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 14
            }}>
              <div style={{ fontSize: 12, color: "#6B5D54", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 600 }}>
                📋 Writing template
              </div>
              <div style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 17,
                lineHeight: 1.5,
                color: "#1F1B16"
              }}>
                The text is about <span style={{ color: "#B85C38" }}>___</span>, and it shows that <span style={{ color: "#B85C38" }}>___</span> <span style={{ color: "#2D5043", fontStyle: "italic" }}>[connector]</span> <span style={{ color: "#B85C38" }}>___</span>.
              </div>
              <div style={{ fontSize: 12.5, color: "#6B5D54", marginTop: 10, lineHeight: 1.5 }}>
                🔗 Connectors you can use: <em>because, so, therefore, and, but, however, although, for example.</em>
              </div>
              <div style={{ marginTop: 10, textAlign: "right" }}>
                <button
                  className="mit-btn-template"
                  onClick={() => handleUseTemplate(TEMPLATE_TEXT)}
                >
                  ↓ Use this template
                </button>
              </div>
              <div style={{
                marginTop: 8,
                fontSize: 12,
                color: "#7A3818",
                background: "#FBF1E5",
                border: "1px solid #E8C9A8",
                borderRadius: 6,
                padding: "8px 10px",
                lineHeight: 1.45
              }}>
                ✋ The template is in lowercase. <strong>You</strong> must add the capital letters and the period at the end of your sentence.
              </div>
            </div>

            <textarea
              className="mit-textarea"
              value={studentSentence}
              onChange={(e) => {
                setStudentSentence(e.target.value);
                if (error) setError(null);
              }}
              placeholder="✍️ Write your one sentence here..."
              disabled={isLoading}
            />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 13, color: "#6B5D54" }}>
                {attempts.length === 0
                  ? "This will be your first attempt."
                  : `Attempt ${attemptNumber}. Previous attempts: ${attempts.length}.`}
              </div>
              <button
                className="mit-btn mit-btn-primary"
                onClick={handleSubmit}
                disabled={isLoading || !studentSentence.trim()}
              >
                {isLoading && <span className="mit-spin" />}
                {isLoading ? "Checking..." : "Get feedback"}
              </button>
            </div>

            {error && (
              <div style={{
                marginTop: 14,
                padding: "10px 14px",
                background: "#F8E5DC",
                border: "1px solid #E0B8A0",
                borderRadius: 8,
                fontSize: 13.5,
                color: "#7A3818"
              }}>
                {error}
              </div>
            )}
          </section>
        )}

        {currentFeedback && (
          <section
            ref={feedbackRef}
            style={{ ...cardStyle, borderColor: "#D4C7A8" }}
            className="mit-fade-in"
          >
            <h2 style={stepTitleStyle}>
              <span style={stepNumberStyle}>4</span>
              💬 Your feedback
            </h2>

            <div style={{ display: "flex", gap: 22, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
              <ScoreRing score={currentFeedback.totalScore} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#1F1B16",
                  lineHeight: 1.4,
                  marginBottom: 4
                }}>
                  {currentFeedback.encouragement}
                </div>
                <div style={{ fontSize: 13, color: "#6B5D54" }}>
                  Attempt {attempts.length} of unlimited.{sessionBest > 0 && ` Best so far: ${sessionBest}/5.`}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <CategoryBar label="Content" score={currentFeedback.scores.content} max={2} />
              <CategoryBar label="Vocabulary" score={currentFeedback.scores.vocabulary} max={1} />
              <CategoryBar label="Sentence structure" score={currentFeedback.scores.structure} max={1} />
              <CategoryBar label="Language (grammar)" score={currentFeedback.scores.language} max={1} />
            </div>

            {currentFeedback.issues && currentFeedback.issues.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#6B5D54",
                  fontWeight: 600,
                  marginBottom: 10
                }}>
                  🔍 Things to look at
                </div>
                {currentFeedback.issues.map((issue, i) => (
                  <div key={i} style={{
                    padding: "12px 14px 12px 16px",
                    background: "#FDFAF2",
                    border: "1px solid #EDE3CE",
                    borderLeft: `3px solid ${CATEGORY_DOTS[issue.category] || "#6B5D54"}`,
                    borderRadius: 8,
                    marginBottom: 8
                  }}>
                    <div style={{
                      fontSize: 11.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: CATEGORY_DOTS[issue.category] || "#6B5D54",
                      fontWeight: 600,
                      marginBottom: 4
                    }}>
                      <span style={{ marginRight: 6 }}>{CATEGORY_EMOJIS[issue.category] || "📝"}</span>
                      {CATEGORY_LABELS[issue.category] || issue.category}
                    </div>
                    <div style={{ fontSize: 14.5, color: "#1F1B16", marginBottom: 4, lineHeight: 1.5 }}>
                      {issue.what}
                    </div>
                    {issue.hint && (
                      <div style={{ fontSize: 13.5, color: "#5A4D43", lineHeight: 1.5, fontStyle: "italic" }}>
                        💡 Hint: {issue.hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {currentFeedback.sampleSentence && (
              <div style={{
                padding: "14px 16px",
                background: "#E8EFE9",
                border: "1px solid #B5C9B8",
                borderRadius: 10,
                marginBottom: 18
              }}>
                <div style={{
                  fontSize: 11.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#2D5043",
                  fontWeight: 600,
                  marginBottom: 6
                }}>
                  ✨ One way to write it
                </div>
                <div style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "#1F1B16",
                  fontStyle: "italic"
                }}>
                  "{currentFeedback.sampleSentence}"
                </div>
                <div style={{ fontSize: 12.5, color: "#5A4D43", marginTop: 8 }}>
                  This is one example. There are many other good answers.
                </div>
              </div>
            )}

            {currentFeedback.totalScore < 5 && (() => {
              const score = currentFeedback.totalScore;
              let headline, body;
              if (score === 4) {
                headline = "🌟 So close! Just one small thing to fix.";
                body = "Read the hint above, then write your sentence again. You can reach 5 out of 5!";
              } else if (score === 3) {
                headline = "💪 Good work! You are almost there.";
                body = "Look at the hints above and write your sentence again. Each try makes you better.";
              } else if (score === 2) {
                headline = "🌱 Nice start! Now let's improve it together.";
                body = "Read each hint slowly. Then write a new sentence using the hints to help you.";
              } else {
                headline = "🤗 Don't worry, this is just practice!";
                body = "Read the hints above carefully, then write a new sentence. Every attempt helps you learn.";
              }
              return (
                <div style={{
                  padding: "14px 16px",
                  background: "#F4EEDC",
                  border: "1px solid #D4C7A8",
                  borderRadius: 10,
                  marginBottom: 14
                }}>
                  <div style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#1F1B16",
                    lineHeight: 1.45,
                    marginBottom: 4
                  }}>
                    {headline}
                  </div>
                  <div style={{ fontSize: 13.5, color: "#5A4D43", lineHeight: 1.55 }}>
                    {body}
                  </div>
                </div>
              );
            })()}

            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 11.5,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#6B5D54",
                fontWeight: 600,
                marginBottom: 6
              }}>
                {currentFeedback.totalScore < 5
                  ? "✏️ Edit your sentence, then try again"
                  : "✨ Try writing another version"}
              </div>
              <textarea
                className="mit-textarea"
                value={editText}
                onChange={(e) => {
                  setEditText(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isLoading}
              />
              {error && (
                <div style={{
                  marginTop: 10,
                  padding: "10px 14px",
                  background: "#F8E5DC",
                  border: "1px solid #E0B8A0",
                  borderRadius: 8,
                  fontSize: 13.5,
                  color: "#7A3818"
                }}>
                  {error}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="mit-btn mit-btn-primary"
                onClick={handleTryAgain}
                disabled={isLoading || !editText.trim()}
              >
                {isLoading && <span className="mit-spin" />}
                {isLoading
                  ? "Checking..."
                  : currentFeedback.totalScore < 5
                    ? "Try again"
                    : "Try another version"}
              </button>
              <button className="mit-btn mit-btn-secondary" onClick={handleNewText} disabled={isLoading}>
                Choose a different text
              </button>
            </div>
          </section>
        )}

        {!selectedText && (
          <div style={{
            textAlign: "center",
            color: "#8A7B6A",
            fontSize: 13.5,
            marginTop: 30,
            fontStyle: "italic"
          }}>
            👆 Pick a text above to begin.
          </div>
        )}

          </>
        )}

      </div>
    </div>
  );
}
