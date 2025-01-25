import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

interface TripPlanProps {
  plan: string;
  isLoading: boolean;
}

export default function TripPlan({ plan, isLoading }: TripPlanProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-12 text-white/80"
      >
        <FaSpinner className="animate-spin text-5xl text-blue-400 mb-4" />
        <p className="text-lg">Crafting your perfect journey...</p>
      </motion.div>
    );
  }

  if (!plan) return null;

  // Split content into sections based on main headings
  const sections = plan.split(/(?=# [A-Z])/).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-8 p-8 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10"
    >
      <div className="space-y-10">
        {sections.map((section, index) => {
          const [header, ...content] = section.split('\n').filter(Boolean);
          const title = header.replace('# ', '');

          return (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Section Header */}
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                {title}
              </h2>

              {/* Section Content */}
              <div className="space-y-4 text-white/90">
                {content.map((line, lineIndex) => {
                  // Day headers (##)
                  if (line.startsWith('## ')) {
                    return (
                      <h3 key={lineIndex} className="text-2xl font-bold text-blue-400 mt-8 first:mt-0">
                        {line.replace('## ', '')}
                      </h3>
                    );
                  }

                  // Time of day headers (###)
                  if (line.startsWith('### ')) {
                    return (
                      <h4 key={lineIndex} className="text-xl font-semibold text-blue-300 ml-4 mt-4">
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }

                  // List items
                  if (line.trim().startsWith('- ')) {
                    return (
                      <div key={lineIndex} className="flex items-start gap-3 ml-6 group">
                        <span className="text-blue-400 mt-1.5 text-lg group-hover:text-blue-300 transition-colors">•</span>
                        <p className="flex-1 leading-relaxed">
                          {line.trim().replace('- ', '')}
                        </p>
                      </div>
                    );
                  }

                  // Bold text sections
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <div key={lineIndex} className="ml-4">
                        <span className="font-semibold text-blue-300">
                          {parts[1].replace(':', '')}:
                        </span>
                        <span className="ml-2">
                          {parts[2]}
                        </span>
                      </div>
                    );
                  }

                  // Regular paragraphs
                  return (
                    <p key={lineIndex} className="leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>

              {/* Section Divider */}
              {index < sections.length - 1 && (
                <div className="mt-10 border-t border-white/10" />
              )}
            </motion.section>
          );
        })}
      </div>
    </motion.div>
  );
}
