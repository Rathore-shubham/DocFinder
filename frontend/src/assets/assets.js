import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
// import doc11 from './doc11.png'
// import doc12 from './doc12.png'
// import doc13 from './doc13.png'
// import doc14 from './doc14.png'
// import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Rajesh Sharma',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Dr. Rajesh Sharma is dedicated to providing quality healthcare, focusing on preventive medicine and early diagnosis.',
        fees: 500,
        address: {
            line1: 'Vijay Nagar, Indore',
            line2: 'Near C21 Mall, Madhya Pradesh'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Neha Gupta',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS, MD (Gynecology)',
        experience: '7 Years',
        about: 'Dr. Neha Gupta specializes in women’s health, offering compassionate and expert gynecological care.',
        fees: 700,
        address: {
            line1: 'Bhawarkua, Indore',
            line2: 'Near IPS Academy, Madhya Pradesh'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Priya Patel',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS, MD (Dermatology)',
        experience: '3 Years',
        about: 'Dr. Priya Patel provides expert skin care solutions, focusing on acne treatment, anti-aging, and skin disorders.',
        fees: 600,
        address: {
            line1: 'Sapna Sangeeta Road, Indore',
            line2: 'Near Treasure Island Mall, Madhya Pradesh'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Rohit Verma',
        image: doc4,
        speciality: 'Pediatrician',
        degree: 'MBBS, MD (Pediatrics)',
        experience: '6 Years',
        about: 'Dr. Rohit Verma is passionate about child healthcare, ensuring the well-being of infants and young children.',
        fees: 550,
        address: {
            line1: 'Rajendra Nagar, Indore',
            line2: 'Near Rau Circle, Madhya Pradesh'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Anjali Mehta',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS, DM (Neurology)',
        experience: '8 Years',
        about: 'Dr. Anjali Mehta specializes in treating neurological disorders with a patient-focused approach.',
        fees: 900,
        address: {
            line1: 'Tilak Nagar, Indore',
            line2: 'Near Bombay Hospital, Madhya Pradesh'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Aman Tiwari',
        image: doc6,
        speciality: 'Gastroenterologist',
        degree: 'MBBS, DM (Gastro)',
        experience: '10 Years',
        about: 'Dr. Aman Tiwari is an expert in treating digestive disorders, liver diseases, and endoscopy procedures.',
        fees: 850,
        address: {
            line1: 'MG Road, Indore',
            line2: 'Near Palasia Square, Madhya Pradesh'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Sneha Joshi',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Sneha Joshi is committed to providing primary healthcare services with a patient-centered approach.',
        fees: 500,
        address: {
            line1: 'Sudama Nagar, Indore',
            line2: 'Near Annapurna Temple, Madhya Pradesh'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Arjun Singh',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS, MS (Gynecology)',
        experience: '6 Years',
        about: 'Dr. Arjun Singh provides specialized care in pregnancy, childbirth, and reproductive health.',
        fees: 750,
        address: {
            line1: 'Scheme 54, Indore',
            line2: 'Near Vijay Nagar Square, Madhya Pradesh'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Radhika Chauhan',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS, MD (Dermatology)',
        experience: '2 Years',
        about: 'Dr. Radhika Chauhan is known for personalized skincare treatments and aesthetic dermatology.',
        fees: 550,
        address: {
            line1: 'Navlakha, Indore',
            line2: 'Near Chappan Dukan, Madhya Pradesh'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Kunal Agarwal',
        image: doc10,
        speciality: 'Pediatrician',
        degree: 'MBBS, MD (Pediatrics)',
        experience: '5 Years',
        about: 'Dr. Kunal Agarwal is an experienced pediatrician specializing in child nutrition and vaccination.',
        fees: 600,
        address: {
            line1: 'LIG Colony, Indore',
            line2: 'Near Bengali Square, Madhya Pradesh'
        }
    },
    // {
    //     _id: 'doc11',
    //     name: 'Dr. Pooja Malhotra',
    //     image: doc11,
    //     speciality: 'Neurologist',
    //     degree: 'MBBS, DM (Neurology)',
    //     experience: '9 Years',
    //     about: 'Dr. Pooja Malhotra has expertise in treating migraines, epilepsy, and other neurological disorders.',
    //     fees: 950,
    //     address: {
    //         line1: 'Bengali Square, Indore',
    //         line2: 'Near Radisson Blu Hotel, Madhya Pradesh'
    //     }
    // },
    // {
    //     _id: 'doc12',
    //     name: 'Dr. Ramesh Dubey',
    //     image: doc12,
    //     speciality: 'Neurologist',
    //     degree: 'MBBS, DM (Neurology)',
    //     experience: '11 Years',
    //     about: 'Dr. Ramesh Dubey is a senior neurologist with vast experience in treating brain and nerve disorders.',
    //     fees: 1000,
    //     address: {
    //         line1: 'Mahalakshmi Nagar, Indore',
    //         line2: 'Near Metro Hospital, Madhya Pradesh'
    //     }
    // },
    // {
    //     _id: 'doc13',
    //     name: 'Dr. Kavita Bhatt',
    //     image: doc13,
    //     speciality: 'General physician',
    //     degree: 'MBBS',
    //     experience: '6 Years',
    //     about: 'Dr. Kavita Bhatt ensures comprehensive treatment for common illnesses and lifestyle disorders.',
    //     fees: 550,
    //     address: {
    //         line1: 'Tilak Nagar, Indore',
    //         line2: 'Near Sayaji Hotel, Madhya Pradesh'
    //     }
    // },
    // {
    //     _id: 'doc14',
    //     name: 'Dr. Manish Jain',
    //     image: doc14,
    //     speciality: 'Gynecologist',
    //     degree: 'MBBS, MD (Gynecology)',
    //     experience: '8 Years',
    //     about: 'Dr. Manish Jain specializes in fertility treatments and high-risk pregnancies.',
    //     fees: 800,
    //     address: {
    //         line1: 'Scheme 74, Indore',
    //         line2: 'Near Khajrana Temple, Madhya Pradesh'
    //     }
    // },
    // {
    //     _id: 'doc15',
    //     name: 'Dr. Nisha Rathi',
    //     image: doc15,
    //     speciality: 'Dermatologist',
    //     degree: 'MBBS, MD (Dermatology)',
    //     experience: '4 Years',
    //     about: 'Dr. Nisha Rathi provides advanced skincare solutions with a focus on medical and cosmetic dermatology.',
    //     fees: 600,
    //     address: {
    //         line1: 'Bhawarkua, Indore',
    //         line2: 'Near Holkar Science College, Madhya Pradesh'
    //     }
    // }
];
