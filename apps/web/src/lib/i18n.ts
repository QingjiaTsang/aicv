import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        error: 'Error occurred',
        confirm: 'Confirm',
        cancel: 'Cancel',
        delete: 'Delete',
        create: 'Create',
        edit: 'Edit',
        save: 'Save',
        search: 'Search',
        upload: 'Upload',
        download: 'Download',
        share: 'Share',
        preview: 'Preview',
        back: 'Back',
        next: 'Next',
        finish: 'Finish',
        close: 'Close',
        updatedAt: 'Updated at {{date}}',
        or: 'or',
      },
      auth: {
        signIn: {
          title: 'Sign In',
          button: {
            start: 'Let AI Boost Your Career',
            google: 'Continue with Google',
            github: 'Continue with GitHub'
          },
          noAccount: "Don't have an account?",
          signUpLink: 'Sign up now',
          form: {
            email: 'Email',
            password: 'Password',
          }
        },
        signUp: {
          title: 'Create Account',
          emailSent: {
            title: 'Verification Email Sent',
            description: 'Please check your email and click the verification link to complete the process.',
          },
          form: {
            name: 'Name',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            button: {
              creating: 'Creating Your AI Space...',
              create: 'Start Your AI Journey',
            }
          },
          errors: {
            emailExists: 'Email already exists',
            passwordMismatch: 'The two passwords you entered do not match',
          },
          haveAccount: 'Already have an account?',
          signInLink: 'Sign in now',
        },
        signOut: 'Sign Out',
        profile: 'Profile',
        settings: 'Settings',
      },
      errors: {
        somethingWentWrong: 'Something went wrong',
        pageNotFound: 'Page Not Found',
        pageNotFoundDesc: 'Sorry, the page you are looking for does not exist',
        refreshPage: 'Refresh Page',
        goHome: 'Go to Home',
        tryAgain: 'Please try again later',
      },
      loading: {
        creatingResume: 'Creating your resume...',
        analyzing: 'AI is analyzing...',
        processing: 'Processing...',
      },
      dashboard: {
        title: 'All Resumes',
        deleteAll: 'Delete All',
        noResumes: 'No resumes yet',
        createResume: 'Create Resume',
        untitledResume: 'Untitled Resume',
        deleteConfirm: {
          title: 'Delete Resume',
          message: 'Are you sure you want to delete this resume?',
        },
        deleteAllConfirm: {
          title: 'Delete All Resumes',
          message: 'Are you sure you want to delete all resumes?',
        },
        filters: {
          all: 'All',
          private: 'Private',
          public: 'Public',
          archived: 'Archived',
        },
        toast: {
          createSuccess: 'Resume created successfully',
          deleteSuccess: 'Resume deleted successfully',
          deleteAllSuccess: 'All resumes deleted',
          deleteAllError: 'Failed to delete all resumes',
          error: 'Operation failed, please try again',
        },
      },
      resume: {
        optimization: {
          title: 'Resume Optimization',
          analyzing: 'AI is analyzing...',
          startOptimize: 'Start Optimization',
          jobDescription: 'Target Job Description',
          currentContent: 'Current Resume Content',
          uploadResume: 'Upload Resume',
          newChat: 'New Chat',
          error: {
            uploadFailed: 'Upload failed',
            optimizeFailed: 'Optimization failed',
            tryAgain: 'Please try again later'
          }
        },
        preview: {
          title: 'Preview',
          download: 'Download',
          share: 'Share',
          delete: 'Delete'
        },
        editor: {
          untitled: 'Untitled Resume',
          lastUpdated: 'Last updated',
          sections: {
            basic: 'Basic Info',
            summary: 'Summary',
            experience: 'Experience',
            education: 'Education',
            skills: 'Skills',
            projects: 'Projects',
            certifications: 'Certifications',
            languages: 'Languages',
            interests: 'Interests',
            company: 'Company'
          }
        }
      },
      navigation: {
        switchLanguage: 'Switch Language',
        switchTheme: 'Switch Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      },
         hero: {
        title: 'AI Resume Builder',
        description: 'Create a professional resume, let AI help you showcase your best career image',
        features: {
          aiSuggestions: 'AI-powered suggestions to optimize your content',
          createNew: 'Create New Resume'
        }
      },
      document: {
        actions: {
          aiOptimization: 'AI Optimization',
          changeTheme: 'Change Theme',
          preview: 'Preview',
          share: 'Share',
          download: 'Download',
          delete: 'Delete',
          previous: 'Previous',
          next: 'Next',
          save: 'Save',
          addEducation: 'Add Education',
          addExperience: 'Add Experience',
          addSkill: 'Add Skill',
          uploadResume: 'Upload Resume'
        },
        colorPicker: {
          title: 'Select Theme Color',
          customColor: 'Custom Color'
        },
        share: {
          title: 'Share Link',
          description: 'Resume is ready to share, copy the link!',
          makePublic: 'To share it with others, you need to make it public.',
          setPublic: 'Public',
          setPrivate: 'Private'
        },
        form: {
          placeholders: {
            summary: 'Example: I\'m a full-stack developer with 5 years of experience, specializing in React and Node.js...',
            experience: 'Describe your main responsibilities, achievements, and work content...',
            education: 'Describe your key academic achievements, awards, projects participated in...',
            company: 'e.g. Ant Group',
          },
          startDate: 'Start Date',
          endDate: 'End Date',
          currentlyEmployed: 'I currently work here',
          workSummary: 'Work Summary',
        },
        toast: {
          deleteSuccess: 'Resume deleted',
          deleteError: 'Failed to delete resume',
          themeUpdateSuccess: 'Theme color updated',
          themeUpdateError: 'Failed to update theme color',
          statusUpdateSuccess: 'Document status updated',
          statusUpdateError: 'Failed to update document status',
          pdfError: 'Failed to generate PDF. Please try again.',
          linkCopied: 'Link copied to clipboard',
        },
        tooltips: {
          preview: 'Preview',
          share: 'Share Link',
          optimize: 'AI Optimization',
          delete: 'Delete',
          changeTheme: 'Change Theme',
          download: 'Download',
        },
        prompts: {
          analyze: {
            summary: 'Please analyze my current resume summary and provide optimization suggestions.',
            experience: 'Please analyze my current resume experience and provide optimization suggestions.',
            all: 'Please analyze my current resume content and provide optimization suggestions.',
          },
          error: {
            analysis: 'Analysis failed, please try again',
            streaming: 'Streaming failed, please try again',
          }
        },
        deleteConfirm: {
          title: 'Delete Resume',
          message: 'Are you sure you want to delete this resume?'
        },
        personalInfo: {
          title: 'Personal Info',
          description: 'Get Started with the personal information',
          firstName: 'First Name',
          lastName: 'Last Name',
          jobTitle: 'Job Title',
          state: 'State/Province',
          city: 'City',
          phone: 'Phone',
          email: 'Email',
          placeholders: {
            firstName: 'Enter your first name',
            lastName: 'Enter your last name',
            jobTitle: 'e.g. Senior Frontend Engineer',
            state: 'e.g. California',
            city: 'e.g. San Francisco',
            phone: 'Enter your phone number',
            email: 'Enter your email address'
          },
          toast: {
            updateSuccess: 'Personal info section updated'
          }
        },
        education: {
          universityName: 'University Name',
          degree: 'Degree',
          major: 'Major',
          academicExperience: 'Academic Experience',
          placeholders: {
            universityName: 'e.g. Harvard University',
            degree: 'e.g. Bachelor\'s Degree',
            major: 'e.g. Computer Science',
          }
        },
        experience: {
          present: 'Present'
        },
        skills: {
          title: 'Skills & Expertise',
          description: 'Add your professional skills and proficiency levels',
          deleteConfirm: {
            title: 'Delete Skill',
            message: 'Are you sure you want to delete this skill?'
          },
          form: {
            skillName: 'Skill Name',
            proficiency: 'Proficiency (1-5)',
            placeholders: {
              skillName: 'e.g. React',
              proficiency: 'Rate 1-5'
            }
          },
          actions: {
            addSkill: 'Add Skill',
            save: 'Save'
          },
          toast: {
            updateSuccess: 'Skills section updated'
          },
          proficiencyLevels: {
            0: 'Foundational',
            1: 'Working',
            2: 'Competent',
            3: 'Proficient', 
            4: 'Strong',
            5: 'Expert'
          }
        },
      },
      optimize: {
        analyzeResume: 'Analyze Resume',
        optimizeSummary: 'Optimize Summary',
        optimizeExperience: 'Optimize Experience',
        newChat: 'New Chat',
        uploadResume: 'Upload Resume',
        uploadSuccess: 'Resume uploaded successfully',
        uploadError: 'Failed to upload resume',
        analyzing: 'AI is analyzing...',
        stopAnalyzing: 'Stop',
        placeholders: {
          jobDescription: 'Enter target job description...',
          currentContent: 'Enter current resume content...'
        },
        button: {
          askAi: 'Ask AI',
          tooltip: 'AI Optimization'
        }
      },
      chat: {
        title: 'AI Optimization',
        minimize: 'Minimize window',
        expand: 'Expand window',
        close: 'Close window',
        typeMessage: 'Type a message...',
        send: 'Send message',
        stop: 'Stop streaming',
        input: {
          placeholder: 'Type a message...',
          send: 'Send message',
          stop: 'Stop generating'
        },
        message: {
          user: 'You',
          assistant: 'AI Assistant'
        },
        prompts: {
          analyze: {
            summary: 'Please analyze my current resume summary and provide optimization suggestions.',
            experience: 'Please analyze my current resume experience and provide optimization suggestions.',
            all: 'Please analyze my current resume content and provide optimization suggestions.',
          },
          error: {
            analysis: 'Analysis failed, please try again',
            streaming: 'Streaming failed, please try again',
          }
        },
        error: {
          analysis: 'Analysis failed, please try again',
          optimization: 'Optimization failed: {error}',
        }
      },
      section: {
        optimize: {
          title: 'AI Optimization',
          summary: 'Optimize Summary',
          experience: 'Optimize Experience',
          button: {
            tooltip: 'AI Optimization',
            label: 'Optimize with AI'
          }
        }
      },
      drawer: {
        title: 'AI Optimization',
        description: 'AI optimization for {title}',
        close: 'Close',
        expand: 'Expand window',
        minimize: 'Minimize window',
      },
      upload: {
        prompt: 'This is my uploaded resume content, please analyze and provide optimization suggestions.',
        error: 'Analysis failed, please try again',
      },
    }
  },
  zh: {
    translation: {
      common: {
        loading: '加载中...',
        error: '出错了',
        confirm: '确认',
        cancel: '取消',
        delete: '删除',
        create: '创建',
        edit: '编辑',
        save: '保存',
        search: '搜索',
        upload: '上传',
        download: '下载',
        share: '分享',
        preview: '预览',
        back: '返回',
        next: '下一步',
        finish: '完成',
        close: '关闭',
        updatedAt: '更新于 {{date}}',
        or: '或',
      },
      auth: {
        signIn: {
          title: '登录',
          button: {
            start: '让 AI 助力你的职业发展',
            google: '使用 Google 账号登录',
            github: '使用 GitHub 账号登录'
          },
          noAccount: '还没有账号？',
          signUpLink: '立即注册',
          form: {
            email: '邮箱',
            password: '密码',
          }
        },
        signUp: {
          title: '创建账号',
          emailSent: {
            title: '验证邮件已发送',
            description: '请检查您的邮箱并点击验证链接完成注册。',
          },
          form: {
            name: '姓名',
            email: '邮箱',
            password: '密码',
            confirmPassword: '确认密码',
            button: {
              creating: '正在创建您的 AI 空间...',
              create: '开启您的 AI 之旅',
            }
          },
          errors: {
            emailExists: '该邮箱已被注册',
            passwordMismatch: '两次输入的密码不一致',
          },
          haveAccount: '已有账号？',
          signInLink: '立即登录',
        },
        signOut: '退出登录',
        profile: '个人资料',
        settings: '设置',
      },
      errors: {
        somethingWentWrong: '出错了',
        pageNotFound: '页面不存在',
        pageNotFoundDesc: '抱歉，您访问的页面不存在',
        refreshPage: '刷新页面',
        goHome: '返回首页',
        tryAgain: '请稍后重试',
      },
      loading: {
        creatingResume: '正在创建简历...',
        analyzing: 'AI 正在分析...',
        processing: '处理中...',
      },
      dashboard: {
        title: '所有简历',
        deleteAll: '删除全部',
        noResumes: '还没有简历',
        createResume: '创建简历',
        untitledResume: '未命名简历',
        deleteConfirm: {
          title: '删除简历',
          message: '确定要删除这份简历吗？',
        },
        deleteAllConfirm: {
          title: '删除所有简历',
          message: '确定要删除所有简历吗？',
        },
        filters: {
          all: '全部',
          private: '私密',
          public: '公开',
          archived: '已归档',
        },
        toast: {
          createSuccess: '简历创建成功',
          deleteSuccess: '简历删除成功',
          deleteError: '删除简历失败',
          deleteAllSuccess: '所有简历已删除',
          deleteAllError: '删除所有简历失败',
          error: '操作失败，请重试',
        },
      },
      resume: {
        optimization: {
          title: '简历优化',
          analyzing: 'AI 正在分析...',
          startOptimize: '开始优化',
          jobDescription: '目标职位描述',
          currentContent: '当前简历内容',
          uploadResume: '上传简历',
          newChat: '新对话',
          error: {
            uploadFailed: '上传失败',
            optimizeFailed: '优化失败',
            tryAgain: '请稍后重试'
          }
        },
        preview: {
          title: '预览',
          download: '下载',
          share: '分享',
          delete: '删除'
        },
        editor: {
          untitled: '未命名简历',
          lastUpdated: '最后更新于',
          sections: {
            basic: '基本信息',
            summary: '个人总结',
            experience: '工作经验',
            education: '教育背景',
            skills: '技能特长',
            projects: '项目经验',
            certifications: '证书认证',
            languages: '语言能力',
            interests: '兴趣爱好',
            company: '公司'
          }
        }
      },
      navigation: {
        switchLanguage: '切换语言',
        switchTheme: '切换主题',
        light: '浅色',
        dark: '深色',
        system: '跟随系统'
      },
      hero: {
        title: 'AI 简历生成器',
        description: '创建专业简历，让 AI 帮助你展现最佳职业形象',
        features: {
          aiSuggestions: 'AI 驱动的内容优化建议',
          createNew: '创建新简历'
        }
      },
      document: {
        actions: {
          aiOptimization: 'AI 优化',
          changeTheme: '更换主题',
          preview: '预览',
          share: '分享',
          download: '下载',
          delete: '删除',
          previous: '上一步',
          next: '下一步',
          save: '保存',
          addEducation: '添加教育经历',
          addExperience: '添加工作经验',
          addSkill: '添加技能',
          uploadResume: '上传简历'
        },
        colorPicker: {
          title: '选择主题颜色',
          customColor: '自定义颜色'
        },
        share: {
          title: '分享链接',
          description: '简历已准备好分享，复制链接！',
          makePublic: '要与他人分享，需要将其设为公开。',
          setPublic: '设为公开',
          setPrivate: '设为私密'
        },
        form: {
          placeholders: {
            summary: '示例：我是一名拥有5年经验的全栈开发者，专注于 React 和 Node.js...',
            experience: '描述你的主要职责、成就和工作内容...',
            education: '描述你的主要学术成就、获奖情况、参与的项目...',
            company: '例如：蚂蚁集团',
          },
          startDate: '开始日期',
          endDate: '结束日期',
          currentlyEmployed: '我目前在这里工作',
          workSummary: '工作内容',
        },
        toast: {
          deleteSuccess: '简历已删除',
          deleteError: '删除简历失败',
          themeUpdateSuccess: '主题颜色已更新',
          themeUpdateError: '更新主题颜色失败',
          statusUpdateSuccess: '文档状态已更新',
          statusUpdateError: '更新文档状态失败',
          pdfError: '生成 PDF 失败，请重试。',
          linkCopied: '链接已复制到剪贴板',
        },
        tooltips: {
          preview: '预览',
          share: '分享链接',
          optimize: 'AI 优化',
          delete: '删除',
          changeTheme: '更换主题',
          download: '下载'
        },
        prompts: {
          analyze: {
            summary: '请分析我的个人总结并提供优化建议。',
            experience: '请分析我的工作经验并提供优化建议。',
            all: '请分析我的简历内容并提供优化建议。',
          },
          error: {
            analysis: '分析失败，请重试',
            streaming: '流式传输失败，请重试',
          }
        },
        deleteConfirm: {
          title: '删除简历',
          message: '确定要删除这份简历吗？'
        },
        personalInfo: {
          title: '个人信息',
          description: '从个人基本信息开始',
          firstName: '名字',
          lastName: '姓氏',
          jobTitle: '职位',
          state: '省份/州',
          city: '城市',
          phone: '电话',
          email: '邮箱',
          placeholders: {
            firstName: '请输入名字',
            lastName: '请输入姓氏',
            jobTitle: '例如：高级前端工程师',
            state: '例如：广东省',
            city: '例如：广州市',
            phone: '请输入电话号码',
            email: '请输入邮箱地址'
          },
          toast: {
            updateSuccess: '个人信息已更新'
          }
        },
        education: {
          universityName: '学校名称',
          degree: '学位',
          major: '专业',
          academicExperience: '学术经历',
          placeholders: {
            universityName: '例如：清华大学',
            degree: '例如：学士学位',
            major: '例如：计算机科学',
          }
        },
        experience: {
          present: '现在'
        },
        skills: {
          title: '技能特长',
          description: '添加你的专业技能和熟练程度',
          deleteConfirm: {
            title: '删除技能',
            message: '确定要删除这个技能吗？'
          },
          form: {
            skillName: '技能名称',
            proficiency: '熟练程度 (1-5)',
            placeholders: {
              skillName: '例如：React',
              proficiency: '评分 1-5'
            }
          },
          actions: {
            addSkill: '添加技能',
            save: '保存'
          },
          toast: {
            updateSuccess: '技能部分已更新'
          },
          proficiencyLevels: {
            0: '入门',
            1: '基础',
            2: '熟练',
            3: '精通',
            4: '专业',
            5: '资深'
          }
        },
      },
      optimize: {
        analyzeResume: '分析简历',
        optimizeSummary: '优化个人总结',
        optimizeExperience: '优化工作经验',
        newChat: '新对话',
        uploadResume: '上传简历',
        uploadSuccess: '简历上传成功',
        uploadError: '简历上传失败',
        analyzing: 'AI 正在分析...',
        stopAnalyzing: '停止',
        placeholders: {
          jobDescription: '请输入目标职位描述...',
          currentContent: '请输入当前简历内容...'
        },
        button: {
          askAi: '询问 AI',
          tooltip: 'AI 优化'
        }
      },
      chat: {
        title: 'AI 优化',
        minimize: '最小化窗口',
        expand: '展开窗口',
        close: '关闭窗口',
        typeMessage: '输入消息...',
        send: '发送消息',
        stop: '停止生成',
        input: {
          placeholder: '输入消息...',
          send: '发送消息',
          stop: '停止生成'
        },
        message: {
          user: '你',
          assistant: 'AI 助手'
        },
        prompts: {
          analyze: {
            summary: '请分析我的个人总结并提供优化建议。',
            experience: '请分析我的工作经验并提供优化建议。',
            all: '请分析我的简历内容并提供优化建议。',
          },
          error: {
            analysis: '分析失败，请重试',
            streaming: '流式传输失败，请重试',
          }
        },
        error: {
          analysis: '分析失败，请重试',
          optimization: '优化失败：{error}',
        }
      },
      section: {
        optimize: {
          title: 'AI 优化',
          summary: '优化个人总结',
          experience: '优化工作经验',
          button: {
            tooltip: 'AI 优化',
            label: '使用 AI 优化'
          }
        }
      },
      drawer: {
        title: 'AI 优化',
        description: '{title} 的 AI 优化',
        close: '关闭',
        expand: '展开窗口',
        minimize: '最小化窗口',
      },
      upload: {
        prompt: '这是我上传的简历内容，请分析并提供优化建议。',
        error: '分析失败，请重试',
      },
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage'],
      // persist and retrieve language config in localStorage
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;