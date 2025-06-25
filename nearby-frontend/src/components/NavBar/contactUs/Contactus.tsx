// ContactUs.tsx
import Contactusform from './ContactUsForm';
/**
 * ContactUs component is a simple wrapper component that renders the Contactusform component.
 *
 * It serves as a dedicated contact section or page element by encapsulating the Contactusform.
 * This component does not manage any state or logic itself; all functionality is delegated to Contactusform.
 *
 * Usage:
 * Use <ContactUs /> wherever you want to include the contact/help button and modal in your application.
 */

const ContactUs = () => {
    return (
        <div>
            <Contactusform />
        </div>
    );
};

export default ContactUs;
