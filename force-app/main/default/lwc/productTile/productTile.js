import { LightningElement , api , wire , track} from 'lwc';
import {publish , MessageContext} from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import msgService from '@salesforce/messageChannel/messageChannelBasket__c';

export default class ProductTile extends LightningElement {

    //get product from parent
    @api product ;

     

    quantity = 0  ;
    //quantity in the basket
    @track
    addedQty = 0 ; 
    
    subscription;

    @wire(MessageContext)
    messageContext ;

    handleQuantity(event){
            this.addedQty = event.target.value ;
    }

    ShowToast(title, message, variant, mode){
         const evt = new ShowToastEvent({
            title: title,
            message:message,
            variant: variant,
            mode: mode
                });
                this.dispatchEvent(evt);
            }

    publishHandler(){

    
        //console.log('product tile',JSON.stringify(this.product));

        if(this.product.product.Quantity__c == 0 || this.product.product.Quantity__c < this.addedQty ){
              
        this.ShowToast('Respect Quantity in stock', 'Not enough product in stock', 'error', 'dismissable');

            console.log('No more product in stock !!');
        }else if(this.addedQty == 0) {
            this.ShowToast('No quantity selected', 'Please enter a quantity', 'error', 'dismissable');

        }else
        {
        
        this.product = { ...this.product, addedQty: this.addedQty , sousTotal:0 };

        //console.log('product',JSON.stringify(this.product))

        const message = {
            lmsData : {
                data:this.product 

            }
        }
        //publish the message
        publish(this.messageContext,msgService,message);
        
        }
       
        
    }
    

    get backgroundStyle() {
        return 'background-image:url('+ this.product.Picture__c +')';
    }
    get tileClass() {
        // Ajoutez une classe conditionnelle en fonction de la quantité du produit
        return this.product.product.Quantity__c == 0 ? 'gray-background tile' : 'tile';
    }

    connectedCallback() {
        //affect the quantity of the product in stock to the temp quantity
        this.tempQuantity = this.product.product.Quantity__c ;
    }
    handleMessage(){
        
    }
    subscribe(){
        this.subscription = subscribe(this.messageContext ,msgService , (message)=>{this.handleMessage(message)} , {scope:APPLICATION_SCOPE})

    }




    get disableButton() {
        return this.product.product.Quantity__c === 0;
    }

}