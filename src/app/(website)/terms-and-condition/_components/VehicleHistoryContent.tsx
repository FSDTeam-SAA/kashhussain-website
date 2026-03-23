import React from "react";

type BulletItem = {
  text: string;
};

type NumberedItem = {
  title: string;
  bullets: BulletItem[];
};

type ContentSection = {
  title: string;
  paragraphs: string[];
  numberedItems?: NumberedItem[];
};

const vehicleHistorySections: ContentSection[] = [
  {
    title: "What is a Vehicle History Check?",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at libero ultricies, viverra velit rutrum, egestas erat. Fusce nec lacus nec enim ornare volutpat. Phasellus vitae ullamcorper felis. Proin venenatis, velit a maximus suscipit, justo nulla blandit tellus, ut vestibulum massa diam vitae tellus. Aliquam lobortis arcu odio, vel sodales elit iaculis eu. Donec rutrum orci eu aliquam interdum. Morbi ac rhoncus nunc. Mauris dictum hendrerit ornare. Donec sed justo ornare, scelerisque nulla id, tincidunt turpis. Ut eget dolor eu sapien pulvinar facilisis scelerisque in tortor. Quisque vehicula finibus placerat. Sed tempus molestie purus, a rutrum justo dapibus ut. Donec eget est at sem volutpat facilisis. Vestibulum accumsan neque arcu, at porttitor dui facilisis elementum.",
      "Aenean efficitur mi ipsum, vitae efficitur metus bibendum venenatis. Sed bibendum, nulla nec ultrices dignissim, ante ipsum molestie ligula, in sodales sem metus eu libero. Sed interdum interdum massa vel porta. Integer luctus malesuada ante at hendrerit. Nullam rhoncus malesuada aliquam. Phasellus sit amet nulla odio. Integer quis sapien sed dolor pharetra rhoncus. Sed condimentum ex sed libero auctor dictum. Curabitur efficitur, turpis eget facilisis lobortis, eros massa dapibus dui, euismod porta felis ex id metus. Vestibulum tincidunt gravida nulla, ut interdum velit venenatis ac. Nulla et ultricies tellus. Ut posuere a nisi eu vulputate. Ut id lacus imperdiet, ornare risus sit amet, egestas nisi. Duis pulvinar faucibus orci sed placerat.",
    ],
  },
  {
    title: "What is a Vehicle History Check?",
    paragraphs: [
      "A vehicle history check helps buyers understand the background and condition of a vehicle before purchasing it. By entering a vehicle registration number, users can access important information such as accident history, theft records, finance status, mileage data, and ownership history.",
      "This check helps buyers avoid risky purchases and ensures transparency when buying a used car. Instead of relying only on the seller's information, customers can verify the vehicle's past using trusted data sources and AI-powered insights.",
    ],
    numberedItems: [
      {
        title: "Vehicle Identity and Basic Details",
        bullets: [
          { text: "Does the registration number match the vehicle?" },
          { text: "Are the make, model, color, and engine details correct?" },
        ],
      },
      {
        title: "Theft and Security Status",
        bullets: [
          { text: "Has the vehicle ever been reported stolen?" },
          { text: "Is the vehicle currently listed in police or security databases?" },
        ],
      },
      {
        title: "Finance and Loan Records",
        bullets: [
          { text: "Does the vehicle have outstanding finance?" },
          { text: "Is the car under hire purchase or lease agreements?" },
        ],
      },
      {
        title: "Accident and Damage History",
        bullets: [
          { text: "Has the vehicle been involved in any accidents?" },
          { text: "Are there salvage or insurance damage records?" },
        ],
      },
      {
        title: "Mileage and Usage Records",
        bullets: [
          { text: "Is the mileage consistent across previous records?" },
          { text: "Are there any signs of mileage discrepancies or rollbacks?" },
        ],
      },
      {
        title: "Ownership History",
        bullets: [
          { text: "How many previous owners has the vehicle had?" },
          { text: "Has the vehicle changed ownership frequently?" },
        ],
      },
    ],
  },
  {
    title: "What is a Vehicle History Check?",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at libero ultricies, viverra velit rutrum, egestas erat. Fusce nec lacus nec enim ornare volutpat. Phasellus vitae ullamcorper felis. Proin venenatis, velit a maximus suscipit, justo nulla blandit tellus, ut vestibulum massa diam vitae tellus. Aliquam lobortis arcu odio, vel sodales elit iaculis eu. Donec rutrum orci eu aliquam interdum. Morbi ac rhoncus nunc. Mauris dictum hendrerit ornare. Donec sed justo ornare, scelerisque nulla id, tincidunt turpis. Ut eget dolor eu sapien pulvinar facilisis scelerisque in tortor. Quisque vehicula finibus placerat. Sed tempus molestie purus, a rutrum justo dapibus ut. Donec eget est at sem volutpat facilisis. Vestibulum accumsan neque arcu, at porttitor dui facilisis elementum.",
      "Aenean efficitur mi ipsum, vitae efficitur metus bibendum venenatis. Sed bibendum, nulla nec ultrices dignissim, ante ipsum molestie ligula, in sodales sem metus eu libero. Sed interdum interdum massa vel porta. Integer luctus malesuada ante at hendrerit. Nullam rhoncus malesuada aliquam. Phasellus sit amet nulla odio. Integer quis sapien sed dolor pharetra rhoncus. Sed condimentum ex sed libero auctor dictum. Curabitur efficitur, turpis eget facilisis lobortis, eros massa dapibus dui, euismod porta felis ex id metus. Vestibulum tincidunt gravida nulla, ut interdum velit venenatis ac. Nulla et ultricies tellus. Ut posuere a nisi eu vulputate. Ut id lacus imperdiet, ornare risus sit amet, egestas nisi. Duis pulvinar faucibus orci sed placerat.",
    ],
  },
  {
    title: "What is a Vehicle History Check?",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at libero ultricies, viverra velit rutrum, egestas erat. Fusce nec lacus nec enim ornare volutpat. Phasellus vitae ullamcorper felis. Proin venenatis, velit a maximus suscipit, justo nulla blandit tellus, ut vestibulum massa diam vitae tellus. Aliquam lobortis arcu odio, vel sodales elit iaculis eu. Donec rutrum orci eu aliquam interdum. Morbi ac rhoncus nunc. Mauris dictum hendrerit ornare. Donec sed justo ornare, scelerisque nulla id, tincidunt turpis. Ut eget dolor eu sapien pulvinar facilisis scelerisque in tortor. Quisque vehicula finibus placerat. Sed tempus molestie purus, a rutrum justo dapibus ut. Donec eget est at sem volutpat facilisis. Vestibulum accumsan neque arcu, at porttitor dui facilisis elementum.",
      "Aenean efficitur mi ipsum, vitae efficitur metus bibendum venenatis. Sed bibendum, nulla nec ultrices dignissim, ante ipsum molestie ligula, in sodales sem metus eu libero. Sed interdum interdum massa vel porta. Integer luctus malesuada ante at hendrerit. Nullam rhoncus malesuada aliquam. Phasellus sit amet nulla odio. Integer quis sapien sed dolor pharetra rhoncus. Sed condimentum ex sed libero auctor dictum. Curabitur efficitur, turpis eget facilisis lobortis, eros massa dapibus dui, euismod porta felis ex id metus. Vestibulum tincidunt gravida nulla, ut interdum velit venenatis ac. Nulla et ultricies tellus. Ut posuere a nisi eu vulputate. Ut id lacus imperdiet, ornare risus sit amet, egestas nisi. Duis pulvinar faucibus orci sed placerat.",
      "Donec lectus orci, ultricies id condimentum et, efficitur et eros. In semper quis velit auctor rhoncus. Mauris ultricies justo quis ante condimentum placerat. Nullam dolor ex, eleifend id fringilla rhoncus, aliquet ac quam. Suspendisse auctor vel eros et volutpat. In a nisi sapien. Vestibulum sit amet risus leo. Donec pulvinar, massa non accumsan eleifend, magna magna facilisis nunc, vel scelerisque erat nulla vitae sem. In sit amet feugiat nisi.",
    ],
  },
  {
    title: "What is a Vehicle History Check?",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at libero ultricies, viverra velit rutrum, egestas erat. Fusce nec lacus nec enim ornare volutpat. Phasellus vitae ullamcorper felis. Proin venenatis, velit a maximus suscipit, justo nulla blandit tellus, ut vestibulum massa diam vitae tellus. Aliquam lobortis arcu odio, vel sodales elit iaculis eu. Donec rutrum orci eu aliquam interdum.",
    ],
  },
];

function NumberedList({ items }: { items: NumberedItem[] }) {
  return (
    <ol className="space-y-5 pl-5 sm:pl-6">
      {items.map((item, index) => (
        <li key={index} className="text-[#555555]">
          <p className="text-[16px] font-normal leading-6 text-[#343A40]">
            {index + 1}. {item.title}
          </p>

          <ul className="mt-1 space-y-1 pl-4">
            {item.bullets.map((bullet, bulletIndex) => (
              <li
                key={bulletIndex}
                className="list-disc text-xs leading-6 text-[#6B7280] sm:text-base"
              >
                {bullet.text}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function ContentBlock({ section }: { section: ContentSection }) {
  return (
    <section className="space-y-4">
      <h3 className="text-[18px] font-semibold leading-normal text-[#111827]">
        {section.title}
      </h3>

      <div className="space-y-5">
        {section.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-6 text-[#6B7280]">
            {paragraph}
          </p>
        ))}
      </div>

      {section.numberedItems?.length ? (
        <div className="pt-1">
          <NumberedList items={section.numberedItems} />
        </div>
      ) : null}
    </section>
  );
}

export default function VehicleHistoryContent() {
  return (
    <section className="bg-[#f6f6f6] py-10 sm:py-14 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6 lg:px-0">
        <div className="space-y-12 sm:space-y-14">
          {vehicleHistorySections.map((section, index) => (
            <ContentBlock key={index} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}
