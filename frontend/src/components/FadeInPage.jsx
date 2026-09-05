import { motion } from 'framer-motion';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const fadeTransition = {
  duration: 0.3,
  ease: "easeInOut"
};

const FadeInPage = ({ children, className = "" }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeVariants}
      transition={fadeTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInPage;
