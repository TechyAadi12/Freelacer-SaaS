const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User.model');
const Client = require('./models/Client.model');
const Project = require('./models/Project.model');
const Invoice = require('./models/Invoice.model');
const TimeEntry = require('./models/TimeEntry.model');
const Payment = require('./models/Payment.model');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Client.deleteMany();
        await Project.deleteMany();
        await Invoice.deleteMany();
        await TimeEntry.deleteMany();
        await Payment.deleteMany();

        console.log('🗑️  Cleared existing data');

        // Create demo user
        const user = await User.create({
            name: 'John Doe',
            email: 'demo@freelancer.com',
            password: 'password123',
            businessName: 'Freelance Studio',
            currency: 'USD',
            timezone: 'America/New_York'
        });

        console.log('👤 Created demo user');

        // Create clients
        const clients = await Client.create([
            {
                user: user._id,
                name: 'Tech Innovations Inc',
                email: 'contact@techinnovations.com',
                phone: '+1 (555) 123-4567',
                company: 'Tech Innovations Inc',
                address: {
                    street: '123 Silicon Valley Blvd',
                    city: 'San Francisco',
                    state: 'CA',
                    zipCode: '94105',
                    country: 'USA'
                },
                status: 'active',
                totalRevenue: 15000,
                projectCount: 2
            },
            {
                user: user._id,
                name: 'Creative Agency Co',
                email: 'hello@creativeagency.com',
                phone: '+1 (555) 234-5678',
                company: 'Creative Agency Co',
                address: {
                    street: '456 Design Street',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                },
                status: 'active',
                totalRevenue: 8500,
                projectCount: 1
            },
            {
                user: user._id,
                name: 'Startup Ventures LLC',
                email: 'info@startupventures.com',
                phone: '+1 (555) 345-6789',
                company: 'Startup Ventures LLC',
                address: {
                    street: '789 Innovation Ave',
                    city: 'Austin',
                    state: 'TX',
                    zipCode: '73301',
                    country: 'USA'
                },
                status: 'active',
                totalRevenue: 12000,
                projectCount: 2
            },
            {
                user: user._id,
                name: 'E-Commerce Solutions',
                email: 'support@ecommsolutions.com',
                phone: '+1 (555) 456-7890',
                company: 'E-Commerce Solutions',
                status: 'active',
                totalRevenue: 5500,
                projectCount: 1
            }
        ]);

        console.log('👥 Created clients');

        // Create projects
        const projects = await Project.create([
            {
                user: user._id,
                client: clients[0]._id,
                name: 'Website Redesign',
                description: 'Complete redesign of company website with modern UI/UX',
                status: 'in-progress',
                priority: 'high',
                startDate: new Date('2026-01-15'),
                endDate: new Date('2026-03-15'),
                budget: 10000,
                hourlyRate: 100,
                billingType: 'hourly',
                totalHours: 45,
                totalEarned: 4500,
                tags: ['web-design', 'react', 'ui-ux']
            },
            {
                user: user._id,
                client: clients[0]._id,
                name: 'Mobile App Development',
                description: 'iOS and Android app for customer engagement',
                status: 'planning',
                priority: 'medium',
                startDate: new Date('2026-02-01'),
                budget: 25000,
                hourlyRate: 120,
                billingType: 'fixed',
                totalHours: 0,
                totalEarned: 0,
                tags: ['mobile', 'react-native', 'ios', 'android']
            },
            {
                user: user._id,
                client: clients[1]._id,
                name: 'Brand Identity Design',
                description: 'Logo, color palette, and brand guidelines',
                status: 'completed',
                priority: 'high',
                startDate: new Date('2025-12-01'),
                endDate: new Date('2026-01-15'),
                budget: 8500,
                hourlyRate: 85,
                billingType: 'fixed',
                totalHours: 60,
                totalEarned: 8500,
                tags: ['branding', 'design', 'logo']
            },
            {
                user: user._id,
                client: clients[2]._id,
                name: 'E-Commerce Platform',
                description: 'Custom e-commerce solution with payment integration',
                status: 'in-progress',
                priority: 'urgent',
                startDate: new Date('2026-01-20'),
                endDate: new Date('2026-04-20'),
                budget: 18000,
                hourlyRate: 110,
                billingType: 'hourly',
                totalHours: 72,
                totalEarned: 7920,
                tags: ['e-commerce', 'stripe', 'nodejs']
            },
            {
                user: user._id,
                client: clients[2]._id,
                name: 'SEO Optimization',
                description: 'Complete SEO audit and optimization',
                status: 'completed',
                priority: 'medium',
                startDate: new Date('2025-11-01'),
                endDate: new Date('2025-12-15'),
                budget: 4000,
                hourlyRate: 80,
                billingType: 'hourly',
                totalHours: 50,
                totalEarned: 4000,
                tags: ['seo', 'marketing']
            },
            {
                user: user._id,
                client: clients[3]._id,
                name: 'Product Photography',
                description: 'Professional product photos for online store',
                status: 'completed',
                priority: 'low',
                startDate: new Date('2025-12-10'),
                endDate: new Date('2026-01-05'),
                budget: 5500,
                hourlyRate: 0,
                billingType: 'fixed',
                totalHours: 0,
                totalEarned: 5500,
                tags: ['photography', 'products']
            }
        ]);

        console.log('📁 Created projects');

        // Create invoices
        const invoices = await Invoice.create([
            {
                user: user._id,
                client: clients[0]._id,
                project: projects[0]._id,
                invoiceNumber: 'INV-00001',
                status: 'paid',
                issueDate: new Date('2026-01-31'),
                dueDate: new Date('2026-02-15'),
                paidDate: new Date('2026-02-10'),
                items: [
                    {
                        description: 'Website Design - 45 hours',
                        quantity: 45,
                        rate: 100,
                        amount: 4500
                    }
                ],
                subtotal: 4500,
                tax: 0,
                discount: 0,
                total: 4500,
                paymentMethod: 'stripe'
            },
            {
                user: user._id,
                client: clients[1]._id,
                project: projects[2]._id,
                invoiceNumber: 'INV-00002',
                status: 'paid',
                issueDate: new Date('2026-01-15'),
                dueDate: new Date('2026-01-30'),
                paidDate: new Date('2026-01-28'),
                items: [
                    {
                        description: 'Brand Identity Design Package',
                        quantity: 1,
                        rate: 8500,
                        amount: 8500
                    }
                ],
                subtotal: 8500,
                tax: 0,
                discount: 0,
                total: 8500,
                paymentMethod: 'bank_transfer'
            },
            {
                user: user._id,
                client: clients[2]._id,
                project: projects[3]._id,
                invoiceNumber: 'INV-00003',
                status: 'sent',
                issueDate: new Date('2026-02-01'),
                dueDate: new Date('2026-02-20'),
                items: [
                    {
                        description: 'E-Commerce Development - 72 hours',
                        quantity: 72,
                        rate: 110,
                        amount: 7920
                    }
                ],
                subtotal: 7920,
                tax: 0,
                discount: 0,
                total: 7920,
                paymentMethod: 'stripe'
            },
            {
                user: user._id,
                client: clients[2]._id,
                project: projects[4]._id,
                invoiceNumber: 'INV-00004',
                status: 'paid',
                issueDate: new Date('2025-12-15'),
                dueDate: new Date('2025-12-30'),
                paidDate: new Date('2025-12-28'),
                items: [
                    {
                        description: 'SEO Optimization - 50 hours',
                        quantity: 50,
                        rate: 80,
                        amount: 4000
                    }
                ],
                subtotal: 4000,
                tax: 0,
                discount: 0,
                total: 4000,
                paymentMethod: 'stripe'
            },
            {
                user: user._id,
                client: clients[3]._id,
                project: projects[5]._id,
                invoiceNumber: 'INV-00005',
                status: 'paid',
                issueDate: new Date('2026-01-05'),
                dueDate: new Date('2026-01-20'),
                paidDate: new Date('2026-01-18'),
                items: [
                    {
                        description: 'Product Photography Package',
                        quantity: 1,
                        rate: 5500,
                        amount: 5500
                    }
                ],
                subtotal: 5500,
                tax: 0,
                discount: 0,
                total: 5500,
                paymentMethod: 'cash'
            },
            {
                user: user._id,
                client: clients[0]._id,
                project: projects[1]._id,
                invoiceNumber: 'INV-00006',
                status: 'draft',
                issueDate: new Date('2026-02-15'),
                dueDate: new Date('2026-03-01'),
                items: [
                    {
                        description: 'Mobile App Development - Milestone 1',
                        quantity: 1,
                        rate: 10000,
                        amount: 10000
                    }
                ],
                subtotal: 10000,
                tax: 0,
                discount: 500,
                total: 9500,
                paymentMethod: 'stripe'
            }
        ]);

        console.log('📄 Created invoices');

        // Create time entries
        const timeEntries = [];
        const now = new Date();

        for (let i = 0; i < 30; i++) {
            const entryDate = new Date(now);
            entryDate.setDate(entryDate.getDate() - i);

            const project = projects[Math.floor(Math.random() * 3)];
            const startTime = new Date(entryDate.setHours(9, 0, 0));
            const duration = Math.floor(Math.random() * 240) + 60; // 1-5 hours in minutes
            const endTime = new Date(startTime.getTime() + duration * 60000);

            timeEntries.push({
                user: user._id,
                project: project._id,
                client: project.client,
                description: `Work on ${project.name}`,
                startTime,
                endTime,
                duration,
                hourlyRate: project.hourlyRate,
                amount: (duration / 60) * project.hourlyRate,
                billable: true,
                invoiced: false
            });
        }

        await TimeEntry.create(timeEntries);
        console.log('⏱️  Created time entries');

        // Create payments for paid invoices
        const paidInvoices = invoices.filter(inv => inv.status === 'paid');
        const payments = paidInvoices.map(invoice => ({
            user: user._id,
            invoice: invoice._id,
            client: invoice.client,
            amount: invoice.total,
            currency: 'USD',
            paymentMethod: invoice.paymentMethod,
            status: 'completed',
            paymentDate: invoice.paidDate
        }));

        await Payment.create(payments);
        console.log('💳 Created payments');

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📧 Demo Login Credentials:');
        console.log('   Email: demo@freelancer.com');
        console.log('   Password: password123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
